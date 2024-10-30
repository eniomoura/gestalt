import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import classnames from 'classnames';
import IconEnd from './IconEnd';
import styles from './VRSelectList.css';
import boxStyles from '../Box.css';
import FormErrorMessage from '../sharedSubcomponents/FormErrorMessage';
import FormHelperText from '../sharedSubcomponents/FormHelperText';
import TextUI from '../TextUI';
import typographyStyle from '../Typography.css';

type SizeType = 'md' | 'lg';

type Props = {
  dataTestId?: string;
  children: ReactNode;
  disabled?: boolean;
  errorMessage?: string;
  helperText?: string;
  id: string;
  label?: string;
  labelDisplay?: 'visible' | 'hidden';
  name?: string;
  onBlur?: (arg1: { event: React.FocusEvent<HTMLSelectElement>; value: string }) => void;
  onChange: (arg1: { event: React.ChangeEvent<HTMLSelectElement>; value: string }) => void;
  onFocus?: (arg1: { event: React.FocusEvent<HTMLSelectElement>; value: string }) => void;
  placeholder?: string;
  size?: SizeType;
  value?: string | null | undefined;
};

const SelectListWithForwardRef = forwardRef<HTMLSelectElement, Props>(function InternalSelectList(
  {
    dataTestId,
    children,
    disabled = false,
    errorMessage,
    helperText,
    id,
    label,
    labelDisplay = 'visible',
    name,
    onBlur,
    onChange,
    onFocus,
    placeholder,
    size = 'md',
    value,
  }: Props,
  ref,
) {
  const innerRef = useRef<null | HTMLInputElement>(null);
  const labelRef = useRef<null | HTMLDivElement>(null);

  // @ts-expect-error - TS2322 - Type 'HTMLDivElement | HTMLInputElement | null' is not assignable to type 'HTMLInputElement'.
  useImperativeHandle(ref, () => innerRef.current);

  const hasErrorMessage = Boolean(errorMessage);

  const isLabelVisible = labelDisplay === 'visible';
  const showPlaceholder = placeholder && !value;

  const isMD = size === 'md';
  const isLG = size === 'lg';

  // ==== STATE ====
  const [focused, setFocused] = useState(false);
  const [ellipsisActive, setEllipsisActive] = useState(false);

  // ==== A11Y ====

  let ariaDescribedby;

  if (hasErrorMessage) {
    ariaDescribedby = `${id}-error`;
  }

  if (helperText) {
    ariaDescribedby = `${id}-helperText`;
  }

  const isEllipsisActive = (element: HTMLElement) =>
    element.offsetHeight < element.scrollHeight || element.offsetWidth < element.scrollWidth;

  const checkEllipsisActive = useCallback(() => {
    if (labelRef.current && !ellipsisActive && isEllipsisActive(labelRef?.current)) {
      setEllipsisActive(true);
    } else if (labelRef.current && ellipsisActive && !isEllipsisActive(labelRef?.current)) {
      setEllipsisActive(false);
    }
  }, [ellipsisActive]);

  useEffect(() => {
    if (!label) return () => {};

    checkEllipsisActive();

    if (typeof window !== 'undefined') window.addEventListener('resize', checkEllipsisActive);

    return () => {
      if (typeof window !== 'undefined') window?.removeEventListener('resize', checkEllipsisActive);
    };
  }, [label, checkEllipsisActive]);

  return (
    <div>
      <div
        className={classnames(styles.inputParent, {
          [styles.enabled]: !disabled,
          [styles.disabled]: disabled,
        })}
      >
        {label && (
          <label
            className={classnames(styles.label, {
              [boxStyles.visuallyHidden]: !isLabelVisible,
              // md
              [styles.md_label]: isMD,
              [styles.md_labelPadding]: isMD,
              // lg
              [styles.lg_label]: isLG,
              [styles.lg_labelPadding]: isLG,
            })}
            htmlFor={id}
            title={ellipsisActive ? label : ''}
          >
            <TextUI
              ref={labelRef}
              color={disabled ? 'disabled' : 'default'}
              lineClamp={1}
              size="xs"
              title={ellipsisActive ? label : ''}
            >
              {label}
            </TextUI>
          </label>
        )}
        {!disabled && <IconEnd disabled={disabled} size={size} />}
        <select
          aria-describedby={focused ? ariaDescribedby : undefined}
          aria-invalid={hasErrorMessage ? 'true' : 'false'}
          className={classnames(styles.input, typographyStyle.truncate, {
            [styles.placeholderText]: !disabled && placeholder && !value,
            [styles.enabledText]:
              (!disabled && placeholder && value) || (!disabled && !placeholder),
            [styles.enabledBorder]: !disabled && !hasErrorMessage,
            [styles.errorBorder]: !disabled && hasErrorMessage,
            [styles.disabledText]: disabled,
            [styles.disabledBorder]: disabled,
            // md
            [styles.md_input]: isMD,
            [styles.md_inputPadding]: isMD,
            [styles.md_inputLabelPadding]: isMD && label && isLabelVisible,
            [styles.md_inputNoLabelPadding]: isMD && (!label || (label && !isLabelVisible)),
            // lg
            [styles.lg_input]: isLG,
            [styles.lg_inputPadding]: isLG,
            [styles.lg_inputLabelPadding]: isLG && label && isLabelVisible,
            [styles.lg_inputNoLabelPadding]: isLG && (!label || (label && !isLabelVisible)),
          })}
          data-test-id={dataTestId}
          disabled={disabled}
          id={id}
          name={name}
          onBlur={(event) => {
            onBlur?.({ event, value: event.currentTarget.value });
            setFocused(false);
          }}
          onChange={(event) => {
            if (value !== event.target.value) {
              onChange({ event, value: event.target.value });
            }
          }}
          onFocus={(event) => {
            onFocus?.({ event, value: event.currentTarget.value });
            setFocused(true);
          }}
          placeholder={placeholder}
          // @ts-expect-error - TS2322 - Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'.
          value={showPlaceholder ? placeholder : value}
        >
          {showPlaceholder && (
            <option disabled hidden value={placeholder}>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </div>

      {helperText && !hasErrorMessage ? (
        <FormHelperText disabled={disabled} id={`${id}-helperText`} size={size} text={helperText} />
      ) : null}

      {!disabled && hasErrorMessage ? (
        <FormErrorMessage id={`${id}-error`} size={size} text={errorMessage} />
      ) : null}
    </div>
  );
});

SelectListWithForwardRef.displayName = 'InternalSelectList';

export default SelectListWithForwardRef;
