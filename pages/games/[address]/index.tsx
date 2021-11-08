import React from 'react';
import { Message } from 'semantic-ui-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import rps from '../../../ethereum/rps';
import GameDetails from '../../../components/GameDetails';

interface Props {
  player1: string;
  player2: string;
  player1moveHash: string;
  player2move: string;
  stake: string;
  lastAction: string;
  address: string;
}

const Game = ({
  player1,
  player2,
  player1moveHash,
  player2move,
  stake,
  lastAction,
  address,
}: Props) => {
  const [player1move, setPlayer1move] = React.useState(null);
  const [salt, setSalt] = React.useState(null);

  const gameDone = Number(stake) === 0;

  React.useEffect(() => {
    const savedMove = localStorage.getItem(player1moveHash);
    if (savedMove) {
      const [move, salt] = savedMove.split(':');
      setPlayer1move(move);
      setSalt(salt);
    }
  }, [player1moveHash]);

  return (
    <Layout>
      <Head>
        <title>Game Details</title>
      </Head>
      <h2 style={{ margin: '24px 0' }}>Game Details: {address}</h2>
      {gameDone ? (
        <Message info>
          <Message.Header>Game finished</Message.Header>
          <p>This game has been finished and eth has been distributed.</p>
        </Message>
      ) : (
        <GameDetails
          player1={player1}
          address={address}
          player2={player2}
          player1move={player1move}
          player2move={player2move}
          lastAction={lastAction}
          stake={stake}
          salt={salt}
        />
      )}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query: { address },
}) => {
  const { methods } = rps(address as string);

  const [player1, player2, player1moveHash, player2move, stake, lastAction] =
    await Promise.all([
      methods.j1().call(),
      methods.j2().call(),
      methods.c1Hash().call(),
      methods.c2().call(),
      methods.stake().call(),
      methods.lastAction().call(),
    ]);

  return {
    props: {
      player1,
      player2,
      player1moveHash,
      player2move,
      stake,
      lastAction,
      address,
    },
  };
};

export default Game;
