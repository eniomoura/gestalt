import { Box, Flex, IconButton, SelectList, Text } from 'gestalt';

export default function Example() {
  return (
    <Box alignItems="center" display="flex" height="100%" justifyContent="center" padding={8}>
      <Flex direction="column" gap={2}>
        <Flex alignItems="center" gap={1}>
          <Text size="300" weight="bold">
            Date range
          </Text>
          <IconButton
            accessibilityLabel="Info"
            icon="info-circle"
            size="sm"
            tooltip={{
              text: 'Options available are based on your usage.',
              idealDirection: 'right',
            }}
          />
        </Flex>

        <SelectList
          id="selectlistexampleHiddenLabel"
          label="Date range"
          labelDisplay="hidden"
          onChange={() => {}}
          size="lg"
        >
          {[
            { label: 'Last 5 days', value: '5' },
            { label: 'Last week', value: '7' },
            { label: 'Last 30 days', value: '30' },
            { label: 'Last sixth months', value: '6m' },
            { label: 'Last year', value: '365' },
          ].map(({ label, value }) => (
            <SelectList.Option key={label} label={label} value={value} />
          ))}
        </SelectList>
      </Flex>
    </Box>
  );
}
