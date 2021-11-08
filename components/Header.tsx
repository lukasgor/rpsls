import React from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const { pathname } = useRouter();
  return (
    <Menu size='huge' pointing secondary>
      <Link href='/'>
        <Menu.Item active={pathname === '/'}>All Games</Menu.Item>
      </Link>
      <Menu.Menu position='right'>
        <Link href='/games/new'>
          <Menu.Item active={pathname === '/games/new'}>
            Start New Game
          </Menu.Item>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
