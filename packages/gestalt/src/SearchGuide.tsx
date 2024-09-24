import React, { cloneElement, forwardRef, ReactElement, useImperativeHandle, useRef } from 'react';
import classnames from 'classnames';
import Box from './Box';
import Flex from './Flex';
import focusStyles from './Focus.css';
import Icon from './Icon';
import styles from './SearchGuide.css';
import touchableStyles from './TapArea.css';
import TextUI from './TextUI';
import useFocusVisible from './useFocusVisible';
import useInExperiment from './useInExperiment';

type Props = {
  /**
   * Specifies the id of an associated element (or elements) whose contents or visibility are controlled by SearchGuide so that screen reader users can identify the relationship between elements.
   */
  accessibilityControls?: string;
  /**
   * Indicates that SearchGuide hides or exposes collapsible components and exposes whether they are currently expanded or collapsed.
   */
  accessibilityExpanded?: boolean;
  /**
   * Indicates that a component controls the appearance of interactive popup elements, such as menu or dialog. See the [Accessibility guidelines](https://gestalt.pinterest.systems/web/searchguide#ARIA-attributes) for details on proper usage.
   */
  accessibilityHaspopup?: boolean;
  /**
   * Label for screen readers to announce SearchGuide. See the [Accessibility guidelines](https://gestalt.pinterest.systems/web/searchguide#ARIA-attributes) for details on proper usage.
   */
  accessibilityLabel?: string;
  /**
   * The background color of SearchGuide.
   * See the [color variant](https://gestalt.pinterest.systems/web/searchguide#Colors) for implementation guidance.
   */
  color?: '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11';
  /**
   * Available for testing purposes, if needed. Consider [better queries](https://testing-library.com/docs/queries/about/#priority) before using this prop.
   */
  dataTestId?: string;
  /**
   * Indicates that the SearchGuide is expandable. See the [expandable variant](https://gestalt.pinterest.systems/web/searchguide#Expandable) to learn more.
   */
  expandable?: boolean;
  /**
   * Callback invoked when the user clicks (press and release) on SearchGuide with the mouse or keyboard.
   */
  onClick?: (arg1: {
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>;
  }) => void;
  /**
   * Toggles between binary states: on/off, selected/unselected, open/closed. See the [selected](#Selected-state) variant to learn more. See the [state variant](https://gestalt.pinterest.systems/web/searchguide#State) for details on proper usage.
   */
  selected?: boolean;
  /**
   * Text to render inside the SearchGuide to convey the function and purpose of the SearchGuide.
   *
   * It can be empty, but is still required as a fallback to accessibilityLabel.
   */
  text: string;
  /**
   * The thumbnail prop is used to display an image or icon to the left of the text. See the [thumbnail variant](https://gestalt.pinterest.systems/web/searchguide#Thumbnail) to learn more.
   */
  thumbnail?:
    | { avatar: ReactElement }
    | { avatarGroup: ReactElement }
    | { image: ReactElement }
    | { icon: ReactElement };
};

/**
 * [SearchGuide](https://gestalt.pinterest.systems/web/searchguide) appends and refines a search query. They appear under [SearchField](/web/searchfield) after user submits a search input.
 *
 * ![SearchGuide light mode](https://raw.githubusercontent.com/pinterest/gestalt/master/playwright/visual-test/SearchGuide.spec.ts-snapshots/SearchGuide-chromium-darwin.png)
 * ![SearchGuide dark mode](https://raw.githubusercontent.com/pinterest/gestalt/master/playwright/visual-test/SearchGuide-dark.spec.ts-snapshots/SearchGuide-dark-chromium-darwin.png)
 *
 */

const SearchGuideWithForwardRef = forwardRef<HTMLButtonElement, Props>(function SearchGuide(
  {
    accessibilityControls,
    accessibilityExpanded,
    accessibilityHaspopup,
    accessibilityLabel,
    color = '01',
    dataTestId,
    expandable,
    onClick,
    selected = false,
    text,
    thumbnail,
  }: Props,
  ref,
) {
  const isInVRExperiment = useInExperiment({
    webExperimentName: 'web_gestalt_visualRefresh',
    mwebExperimentName: 'web_gestalt_visualRefresh',
  });

  const innerRef = useRef<null | HTMLButtonElement>(null);

  // When using both forwardRef and innerRef, React.useimperativehandle() allows a parent component
  // that renders <SearchGuide ref={inputRef} /> to call inputRef.current.focus()
  // @ts-expect-error - TS2322 - Type 'HTMLButtonElement | null' is not assignable to type 'HTMLButtonElement'.
  useImperativeHandle(ref, () => innerRef.current);
  const { isFocusVisible } = useFocusVisible();

  const buttonClasses = isInVRExperiment
    ? classnames(styles.searchguideVr, touchableStyles.tapTransition, [styles[`color${color}`]], {
        [focusStyles.hideOutline]: !isFocusVisible,
        [styles.vrFocused]: isFocusVisible,
        [styles.selected]: selected,
      })
    : classnames(styles.searchguide, touchableStyles.tapTransition, [styles[`color${color}`]], {
        [styles.selected]: selected,
        [focusStyles.hideOutline]: !isFocusVisible,
        [focusStyles.accessibilityOutline]: isFocusVisible,
      });
  const childrenDivClasses = classnames(styles.childrenDiv);

  const textComponent = (
    <TextUI align="center" color="dark" overflow="noWrap">
      {text}
    </TextUI>
  );
  const avatarVariant = thumbnail && (
    <Flex alignItems="center" gap={{ row: 2, column: 0 }} justifyContent="center">
      {'avatar' in thumbnail && (
        <Box aria-hidden minWidth={40}>
          {cloneElement(thumbnail.avatar, { size: 'fit' })}
        </Box>
      )}
      {'avatarGroup' in thumbnail && cloneElement(thumbnail.avatarGroup, { size: 'sm' })}
      <Box marginEnd={3}>{textComponent}</Box>
      {expandable ? <Icon accessibilityLabel="" color="dark" icon="arrow-down" size={12} /> : null}
    </Flex>
  );
  const defaultVariant = (
    <Box paddingX={5}>
      <Flex alignItems="center" gap={{ row: 2, column: 0 }} justifyContent="center">
        {thumbnail && 'image' in thumbnail && (
          <Box aria-hidden minWidth={40}>
            {cloneElement(thumbnail.image)}
          </Box>
        )}
        {thumbnail && 'icon' in thumbnail && cloneElement(thumbnail.icon)}
        {textComponent}
        {expandable ? (
          <Icon accessibilityLabel="" color="dark" icon="arrow-down" size={12} />
        ) : null}
      </Flex>
    </Box>
  );
  return (
    <button
      ref={innerRef}
      aria-controls={accessibilityControls}
      aria-expanded={accessibilityExpanded}
      aria-haspopup={accessibilityHaspopup || expandable}
      aria-label={accessibilityLabel}
      className={buttonClasses}
      data-test-id={dataTestId}
      onClick={(event) => {
        onClick?.({ event });
      }}
      type="button"
    >
      <div className={childrenDivClasses}>
        {thumbnail && ('avatar' in thumbnail || 'avatarGroup' in thumbnail)
          ? avatarVariant
          : defaultVariant}
      </div>
    </button>
  );
});

SearchGuideWithForwardRef.displayName = 'SearchGuide';

export default SearchGuideWithForwardRef;