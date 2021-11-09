import React from 'react';
import { Grid, Button, Card } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import moves from '../common/moves';
import Player2MoveModal from './Player2MoveModal';
import game from '../ethereum/rps';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

function diff_minutes(dt2: Date, dt1: Date) {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

interface Props {
  player1: string;
  player2: string;
  player1move: string | null;
  player2move: string;
  stake: string;
  lastAction: string;
  address: string;
  salt: string;
}

const GameDetails = ({
  player1,
  player2,
  stake,
  lastAction,
  player1move,
  player2move,
  salt,
  address,
}: Props) => {
  const [moveHidden, setMoveHidden] = React.useState(true);
  const [moveModalOpen, setMoveModalOpen] = React.useState(false);
  const [submittingMove, setSubmittingMove] = React.useState(false);
  const [solving, setSolving] = React.useState(false);
  const [player1TimingOut, setPlayer1TimingOut] = React.useState(false);
  const [player2TimingOut, setPlayer2TimingOut] = React.useState(false);
  const gameInstance = React.useMemo(() => game(address), [address]);

  const { replace } = useRouter();

  const submitPlayer2Move = async (move: number) => {
    setMoveModalOpen(false);
    setSubmittingMove(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await gameInstance.methods.play(move).send({
        from: accounts[0],
        value: stake,
      });
      toast('Move successfully submitted!', { type: 'success' });
      replace(`/games/${address}`);
    } catch (e) {
      toast(`${e.message}`, { type: 'error' });
    } finally {
      setSubmittingMove(false);
    }
  };

  const solve = async () => {
    setSolving(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await gameInstance.methods.solve(player1move, salt).send({
        from: accounts[0],
      });
      toast.success('Game has been resolved!', { type: 'success' });
      replace(`/games/${address}`);
    } catch (e) {
      toast(`${e.message}`, { type: 'error' });
    } finally {
      setSolving(false);
    }
  };

  const timeoutPlayer1 = async () => {
    setPlayer1TimingOut(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await gameInstance.methods.j1Timeout().send({
        from: accounts[0],
      });
      toast.success('Game has been timedout!', { type: 'success' });
      replace(`/games/${address}`);
    } catch (e) {
      toast(`${e.message}`, { type: 'error' });
    } finally {
      setPlayer1TimingOut(false);
    }
  };

  const timeoutPlayer2 = async () => {
    setPlayer2TimingOut(true);
    try {
      const accounts = await web3.eth.getAccounts();
      await gameInstance.methods.j2Timeout().send({
        from: accounts[0],
      });
      toast.success('Game has been timedout!', { type: 'success' });
      replace(`/games/${address}`);
    } catch (e) {
      toast(`${e.message}`, { type: 'error' });
    } finally {
      setPlayer2TimingOut(false);
    }
  };

  const processing =
    submittingMove || solving || player1TimingOut || player2TimingOut;

  return (
    <>
      {moveModalOpen && (
        <Player2MoveModal
          onDismiss={() => {
            setMoveModalOpen(false);
          }}
          onConfirm={submitPlayer2Move}
        />
      )}
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Card
              fluid
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'elipsis',
              }}
              header={player1}
              meta='Player1'
              description='Player that started the game'
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              fluid
              header={player2}
              style={{ overflow: 'hidden' }}
              meta='Player2'
              description='Opponent invited by Player1'
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Card
              fluid
              header={web3.utils.fromWei(stake, 'ether')}
              meta='Stake in ether'
              description='Current stake of the game that will be transfered to the winner or split in case of a tie.'
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              fluid
              header={diff_minutes(
                new Date(Number(lastAction) * 1000),
                new Date(),
              )}
              meta='Minutes'
              description='Minutes since last action'
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Card
              fluid
              header={moveHidden ? 'Hidden' : moves[player1move].name}
              meta={'Player1 move, can only be revealed in his browser.'}
              description={
                <div>
                  <Button
                    onClick={() => setMoveHidden(!moveHidden)}
                    disabled={!Boolean(player1move)}
                    size='mini'
                    style={{ marginTop: '8px' }}
                    basic
                  >
                    {moveHidden ? 'Show' : 'Hide'}
                  </Button>
                </div>
              }
            />
          </Grid.Column>
          <Grid.Column>
            <Card
              fluid
              header={moves[player2move].name}
              meta='Player2 move'
              description='Player2 move, it displays "None" if the move is not commited yet.'
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <h3>Actions:</h3>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={processing || Boolean(Number(player2move))}
                onClick={() => setMoveModalOpen(true)}
                loading={submittingMove}
                primary
              >
                Player2 Move
              </Button>
              <Button
                loading={player1TimingOut}
                onClick={timeoutPlayer1}
                disabled={processing || !Boolean(Number(player2move))}
                basic
              >
                Timeout Player1
              </Button>
              <Button
                loading={player2TimingOut}
                onClick={timeoutPlayer2}
                disabled={processing || Boolean(Number(player2move))}
                basic
              >
                Timeout Player2
              </Button>
              <Button
                disabled={processing || !Boolean(Number(player2move))}
                color='green'
                onClick={solve}
                loading={solving}
              >
                Solve
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
};

export default GameDetails;
