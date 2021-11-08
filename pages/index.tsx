import React from 'react';
import { CardGroup } from 'semantic-ui-react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import Link from 'next/link';

interface Props {
  games: string[];
}

const Index = ({ games }: Props) => {
  return (
    <Layout>
      <Head>
        <title>All Games</title>
      </Head>
      <h3>Games:</h3>
      <CardGroup
        items={games.map((address) => ({
          header: address,
          description: (
            <Link href={`/games/${address}`}>
              <a>View Game</a>
            </Link>
          ),
          fluid: true,
        }))}
      />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const games = await factory.methods.getDeployedGames().call();

  return {
    props: {
      games,
    },
  };
};

export default Index;
