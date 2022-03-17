import React from "react";
import useSWR from "swr";
import Head from "next/head";
import {
  Input,
  Button,
  Box,
  Heading,
  Text,
  Container,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import TweetEmbed from "react-tweet-embed";

const fetcher = (url) => fetch(url).then((r) => r.json());

const FetchTweets = ({ id }) => {
  const { data, isLoading, error } = useSWR(`api/tweet/${id}`, fetcher);

  if (isLoading) return <Spinner />;

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        No Data on this userId - {id}
      </Alert>
    );

  return (
    <>
      {data?.total > 0 &&
        data?.tweetIds.map((item) => (
          <Box key={item.id} mx="10">
            <TweetEmbed tweetId={item.id} options={{ align: "center" }} />
          </Box>
        ))}

      {data?.total === 0 && (
        <Alert status="error">
          <AlertIcon />
          No Data on this userId - {id}
        </Alert>
      )}
    </>
  );
};

const Home = () => {
  const [value, setValue] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <>
      <Head>
        <title>Best Tweets</title>
        <meta name="description" content="Find the best tweet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container maxW="container.lg" textAlign="center">
          <Box pt="40" pb="20">
            <Heading as="h2" size="xl" textTransform="uppercase">
              Find out the most ❤️ tweet
            </Heading>

            <Text fontSize="md">
              Insert twitter handle to get the top tweets
            </Text>
          </Box>

          <Box
            display="flex"
            pb="10"
            justifyContent="center"
            alignContent="center"
          >
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Put the twitter handle here"
              size="md"
              width="500px"
              mr="3"
            />

            <Button colorScheme="blue" onClick={() => setSearchQuery(value)}>
              Search
            </Button>
          </Box>

          {searchQuery && <FetchTweets id={searchQuery} />}
        </Container>
      </main>
    </>
  );
};

export default Home;
