import { useState } from 'react';
import { Box, Flex, Text, useFocusVisible } from 'gestalt';
import { TOKEN_COLOR_BORDER_FOCUS } from 'gestalt-design-tokens';

export default function UseFocusVisibleExample() {
  const { isFocusVisible } = useFocusVisible();
  const [focusedButton1, setFocusedButton1] = useState(false);
  const [focusedButton2, setFocusedButton2] = useState(false);

  return (
    <Box height="100%" padding={4}>
      <Flex
        alignItems="center"
        direction="column"
        gap={{
          row: 0,
          column: 12,
        }}
      >
        <Flex
          alignItems="center"
          direction="column"
          gap={{
            row: 0,
            column: 4,
          }}
        >
          <Text>Using useFocusVisible(): Focus ring is only visible when using keyboard</Text>
          <button
            onBlur={() => setFocusedButton1(false)}
            onFocus={() => setFocusedButton1(true)}
            style={{
              outline:
                isFocusVisible && focusedButton1
                  ? `4px solid ${TOKEN_COLOR_BORDER_FOCUS}`
                  : undefined,
            }}
            type="button"
          >
            <Text color="dark">Button 1</Text>
          </button>
        </Flex>
        <Flex
          alignItems="center"
          direction="column"
          gap={{
            row: 0,
            column: 4,
          }}
        >
          <Text>Not using useFocusVisible(): Focus ring is always visible</Text>
          <button
            onBlur={() => setFocusedButton2(false)}
            onFocus={() => setFocusedButton2(true)}
            style={{
              outline: focusedButton2 ? `4px solid ${TOKEN_COLOR_BORDER_FOCUS}` : undefined,
            }}
            type="button"
          >
            <Text color="dark">Button 2</Text>
          </button>
        </Flex>
      </Flex>
    </Box>
  );
}
