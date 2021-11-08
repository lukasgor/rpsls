import React from 'react';
import { Form, Radio } from 'semantic-ui-react';
import moves from '../common/moves';

type Props = {
  move: number;
  onMoveChange: (a: number) => void;
};

const MovePicker = ({ move, onMoveChange }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
      }}
    >
      <Form.Field>
        <Radio
          label={moves['1'].name}
          name='radioGroup'
          value={moves['1'].id}
          checked={moves['1'].id === move}
          onChange={(e, { value }) => onMoveChange(Number(value))}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label={moves['2'].name}
          name='radioGroup'
          value={moves['2'].id}
          checked={moves['2'].id === move}
          onChange={(e, { value }) => onMoveChange(Number(value))}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label={moves['3'].name}
          name='radioGroup'
          value={moves['3'].id}
          checked={moves['3'].id === move}
          onChange={(e, { value }) => onMoveChange(Number(value))}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label={moves['4'].name}
          name='radioGroup'
          value={moves['4'].id}
          checked={moves['4'].id === move}
          onChange={(e, { value }) => onMoveChange(Number(value))}
        />
      </Form.Field>
      <Form.Field>
        <Radio
          label={moves['5'].name}
          name='radioGroup'
          value={moves['5'].id}
          checked={moves['5'].id === move}
          onChange={(e, { value }) => onMoveChange(Number(value))}
        />
      </Form.Field>
    </div>
  );
};

export default MovePicker;
