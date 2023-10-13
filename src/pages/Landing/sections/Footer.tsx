import { Link as RRDLink } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { Body1, Box, H3 } from '../components/Generics'
import { Discord, Github, Instagram, Twitter } from '../components/Icons'

export function Footer() {
  return (
    <Box as="footer" direction="column" align="center" padding="0 24px">
      <Box direction="row" maxWidth="1328px" gap="24px">
        <RowToCol direction="row" justify-content="space-between" gap="32px">
          <Box direction="column" height="100%" gap="64px">
            <Box direction="column" gap="10px">
              <H3>© 2023</H3>
              <H3>Uniswap Labs</H3>
            </Box>
            <HideWhenSmall>
              <Socials />
            </HideWhenSmall>
          </Box>

          <RowToCol direction="row" height="100%" gap="16px">
            <Box direction="row">
              <Box direction="column" gap="10px">
                <Body1>App</Body1>
                <Link as="a" href="https://app.uniswap.org/swap">
                  Swap
                </Link>
                <Link as="a" href="https://app.uniswap.org/tokens/ethereum">
                  Tokens
                </Link>
                <Link as="a" href="https://app.uniswap.org/nfts">
                  NFTs
                </Link>
                <Link as="a" href="https://app.uniswap.org/pools">
                  Pools
                </Link>
              </Box>
              <Box direction="column" gap="10px">
                <Body1>Protocol</Body1>
                <Link to="/community">Community</Link>
                <Link to="/governance">Governance</Link>
                <Link to="/developers">Developers</Link>
              </Box>
            </Box>
            <Box direction="row">
              <Box direction="column" gap="10px">
                <Body1>Company</Body1>
                <Link as="a" href="https://boards.greenhouse.io/uniswaplabs">
                  Careers
                </Link>
                <Link as="a" href="https://blog.uniswap.org/">
                  Blog
                </Link>
              </Box>
              <Box direction="column" gap="10px">
                <Body1>Need help?</Body1>
                <Link to="/contact">Contact us</Link>
                <Link as="a" href="https://support.uniswap.org/hc/en-us">
                  Help Center
                </Link>
              </Box>
            </Box>
          </RowToCol>
          <HideWhenLarge>
            <Socials />
          </HideWhenLarge>
        </RowToCol>
      </Box>
    </Box>
  )
}

function Socials() {
  const theme = useTheme()

  return (
    <Box gap="24px">
      <Box as="a" href="" flex="0">
        <Github fill={theme.neutral1} />
      </Box>
      <Box as="a" href="" flex="0">
        <Twitter fill={theme.neutral1} />
      </Box>
      <Box as="a" href="" flex="0">
        <Discord fill={theme.neutral1} />
      </Box>
      <Box as="a" href="" flex="0">
        <Instagram fill={theme.neutral1} />
      </Box>
    </Box>
  )
}

const RowToCol = styled(Box)`
  height: auto;
  flex-shrink: 1;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const HideWhenSmall = styled(Box)`
  @media (max-width: 768px) {
    display: none;
  }
`
const HideWhenLarge = styled(Box)`
  @media (min-width: 768px) {
    display: none;
  }
`

const Link = styled(RRDLink)`
  padding: 0;
  margin: 0;
  text-align: center;
  /* Body/2 */
  font-family: Basel;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px; /* 150% */
  color: ${({ theme }) => theme.neutral2};
  transition: color 0.1s ease-in-out;
  text-decoration: none;
  &:hover {
    color: ${({ theme }) => theme.neutral1};
  }
`
