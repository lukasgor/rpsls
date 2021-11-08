import React from 'react';
import { Button, Modal } from 'semantic-ui-react';
import Move from '../common/moves';
import MovePicker from './MovePicker';

type Props = {
  onDismiss: () => void;
  onConfirm: (a: number) => void;
};

const Player2MoveModal = ({ onDismiss, onConfirm }: Props) => {
  const [move, setMove] = React.useState(Move[0].id);
  return (
    <Modal onClose={onDismiss} open>
      <Modal.Header>Pick your move</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <MovePicker move={move} onMoveChange={setMove} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button basic onClick={onDismiss}>
          Cancel
        </Button>
        <Button
          content='Confirm'
          labelPosition='right'
          disabled={!Boolean(move)}
          onClick={() => {
            onConfirm(move);
          }}
          icon='checkmark'
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default Player2MoveModal;
