import { Flex, Icon, TapArea, Tooltip } from 'gestalt';

export default function Example() {
  return (
    <Flex alignItems="center" height="100%" justifyContent="center" width="100%">
      <Tooltip accessibilityLabel="" text="Share pin">
        <TapArea>
          <Icon accessibilityLabel="Share Pin" color="default" icon="share" />
        </TapArea>
      </Tooltip>
    </Flex>
  );
}
