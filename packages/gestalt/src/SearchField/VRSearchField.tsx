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
import styles from './VRSearchField.css';
import boxStyles from '../Box.css';
import Icon from '../Icon';
import Pog from '../Pog';
import FormErrorMessage from '../sharedSubcomponents/FormErrorMessage';
import TapArea from '../TapArea';
import { autoCompleteType } from '../TextField/InternalTextField';
import TextUI from '../TextUI';
import typographyStyle from '../Typography.css';

const ENTER: number = 13;
const SPACE: number = 32;
const TAB: number = 9;

type SizeType = 'sm' | 'md' | 'lg';

type Props = {
  // REQUIRED
  id: string;
  onChange: (arg1: { event: React.ChangeEvent<HTMLInputElement>; value: string }) => void;
  // OPTIONAL
  autoComplete?: autoCompleteType;
  dataTestId?: string;
  errorMessage?: ReactNode;
  hasError?: boolean;
  label?: string;
  labelDisplay?: 'visible' | 'hidden';
  onBlur?: (arg1: { event: React.FocusEvent<HTMLInputElement>; value: string }) => void;
  onClick?: (arg1: { event: React.MouseEvent<HTMLInputElement>; value: string }) => void;
  onFocus?: (arg1: { event: React.FocusEvent<HTMLInputElement>; value: string }) => void;
  onKeyDown?: (arg1: { event: React.KeyboardEvent<HTMLInputElement>; value: string }) => void;
  placeholder?: string;
  size?: SizeType;
  value?: string;
};

const SearchFieldWithForwardRef = forwardRef<HTMLInputElement, Props>(function TextField(
  {
    autoComplete,
    dataTestId,
    errorMessage,
    hasError = false,
    id,
    label,
    labelDisplay,
    onBlur,
    onChange,
    onClick,
    onFocus,
    onKeyDown,
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
  const isClearIconButtonVisible = !!value;

  const isMD = size === 'md';
  const isLG = size === 'lg';

  // ==== STATE ====
  const [focused, setFocused] = useState(false);
  const [ellipsisActive, setEllipsisActive] = useState(false);
  const [iconFocused, setIconFocused] = useState(false);

  // ==== A11Y ====

  const ariaDescribedby = hasErrorMessage ? `${id}-error` : undefined;

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
      <div className={classnames(styles.inputParent)}>
        {label && (
          <label
            className={classnames(styles.label, {
              // md
              [styles.md_label]: isMD,
              // lg
              [styles.lg_label]: isLG,

              [boxStyles.visuallyHidden]: !isLabelVisible,
            })}
            htmlFor={id}
          >
            <TextUI
              ref={labelRef}
              color="default"
              lineClamp={1}
              size="xs"
              title={ellipsisActive ? label : ''}
            >
              {label}
            </TextUI>
          </label>
        )}

        <div
          aria-hidden
          className={classnames({
            [styles.startIconLabelWrapper]: label,
            [styles.md_startIcon]: isMD,
            [styles.lg_startIcon]: isLG,
            [styles.md_startIconLabel]: label && isMD,
            [styles.lg_startIconLabel]: label && isLG,
            [styles.startIconNoLabelWrapper]: !label || !isLabelVisible,
          })}
        >
          <div className={styles.startIcon}>
            <Icon accessibilityLabel="" color="default" icon="search" size={16} />
          </div>
        </div>

        <input
          ref={innerRef}
          aria-describedby={focused ? ariaDescribedby : undefined}
          aria-invalid={hasErrorMessage || hasError ? 'true' : 'false'}
          autoComplete={autoComplete}
          className={classnames(
            styles.input,
            typographyStyle.truncate,
            typographyStyle.lineClamp,
            styles.enabled,
            styles.enabledText,
            {
              [styles.enabledBorder]: !hasErrorMessage,
              [styles.errorBorder]: hasErrorMessage,
              // md
              [styles.md_input]: isMD,
              [styles.md_inputHorizontalPadding]: isMD,
              [styles.md_inputLabelPadding]: isMD && label && isLabelVisible,
              [styles.md_inputNoLabelPadding]: isMD && (!label || (label && !isLabelVisible)),
              // lg
              [styles.lg_input]: isLG,
              [styles.lg_inputHorizontalPadding]: isLG,
              [styles.lg_inputLabelPadding]: isLG && label && isLabelVisible,
              [styles.lg_inputNoLabelPadding]: isLG && (!label || (label && !isLabelVisible)),
            },
          )}
          data-test-id={dataTestId}
          enterKeyHint="search"
          id={id}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.({ event, value: event.currentTarget.value });
          }}
          onChange={(event) => {
            onChange({ event, value: event.currentTarget.value });
          }}
          onClick={(event) => onClick?.({ event, value: event.currentTarget.value })}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.({ event, value: event.currentTarget.value });
          }}
          onKeyDown={(event) => onKeyDown?.({ event, value: event.currentTarget.value })}
          placeholder={placeholder}
          role="searchbox"
          value={value}
        />
        {isClearIconButtonVisible ? (
          <div className={classnames(styles.endClearButtonWrapper)}>
            <div
              className={classnames({
                [styles.endClearButton]: true,
              })}
            >
              <TapArea
                accessibilityLabel="Clear date"
                onBlur={() => setIconFocused(false)}
                onFocus={() => setIconFocused(true)}
                onKeyDown={({ event }) => {
                  if ([ENTER, SPACE].includes(event.keyCode)) {
                    innerRef?.current?.focus();
                    // @ts-expect-error - TS2322 - Type 'KeyboardEvent<HTMLDivElement>' is not assignable to type 'ChangeEvent<HTMLInputElement>'.
                    onChange({ value: '', event });
                  }
                  if (event.keyCode !== TAB) event.preventDefault();
                }}
                onMouseEnter={() => setIconFocused(true)}
                onMouseLeave={() => setIconFocused(false)}
                onTap={({ event }) => {
                  innerRef?.current?.focus();
                  // @ts-expect-error - TS2322 - Type 'KeyboardEvent<HTMLDivElement>' is not assignable to type 'ChangeEvent<HTMLInputElement>'.
                  onChange({ value: '', event });
                }}
                rounding={2}
                tapStyle="compress"
              >
                <Pog
                  accessibilityLabel=""
                  bgColor={iconFocused ? 'lightGray' : 'transparent'}
                  icon="clear"
                  iconColor="darkGray"
                  size="sm"
                />
              </TapArea>
            </div>
          </div>
        ) : null}
      </div>

      {hasErrorMessage ? (
        <FormErrorMessage id={`${id}-error`} size={size} text={errorMessage} topPadding="200" />
      ) : null}
    </div>
  );
});

SearchFieldWithForwardRef.displayName = 'SearchField';

export default SearchFieldWithForwardRef;
