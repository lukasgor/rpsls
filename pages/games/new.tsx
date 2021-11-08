import React from 'react';
import { Form, Button, Input, Message, Segment } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import moves from '../../common/moves';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import hasher from '../../ethereum/hasher';
import web3 from '../../ethereum/web3';
import MovePicker from '../../components/MovePicker';
import { toast } from 'react-toastify';

const NewGame = () => {
  const [stake, setStake] = React.useState('');
  const [opponentAddress, setOpponentAddress] = React.useState('');
  const [move, setMove] = React.useState<number>(moves[0].id);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const accounts = await web3.eth.getAccounts();
      const salt = web3.utils.randomHex(32);
      const hash = await hasher.methods.hash(move, salt).call();
      await factory.methods.createGame(hash, opponentAddress).send({
        from: accounts[0],
        value: web3.utils.toWei(stake, 'ether'),
      });
      localStorage.setItem(hash, `${move}:${salt}`);
      router.push('/');
      toast('Game has been successfully created', { type: 'success' });
    } catch (e) {
      setErrorMessage(e.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <Head>
        <title>Start New Game</title>
      </Head>
      <Form onSubmit={onSubmit} error={Boolean(errorMessage)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: '320px',
            maxWidth: '420px',
            margin: 'auto',
          }}
        >
          <h3 style={{ textAlign: 'center' }}>Create a Game</h3>
          <Form.Field>
            <label htmlFor='stake'>Stake</label>
            <Input
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              label='ether'
              id='stake'
              labelPosition='right'
            />
          </Form.Field>
          <Form.Field>
            <label htmlFor='opponent-address'>Opponent Address</label>
            <Input
              value={opponentAddress}
              onChange={(e) => setOpponentAddress(e.target.value)}
              id='opponent-address'
            />
          </Form.Field>
          <Form.Field>Your move:</Form.Field>
          <MovePicker move={move} onMoveChange={setMove} />
          <Button
            disabled={loading || !stake || !opponentAddress || !move}
            loading={loading}
            primary
          >
            Start the Game!
          </Button>
          <Segment>
            <i>
              Keep in mind that we store your move inside browser&apos;s
              localStorage, therefore you&apos;ll be able to close this game
              only from this browser.
            </i>
          </Segment>
        </div>
        <Message error header='Oops!' content={errorMessage} />
      </Form>
    </Layout>
  );
};

export default NewGame;
