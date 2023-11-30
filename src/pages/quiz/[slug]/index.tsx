/* eslint-disable react-hooks/rules-of-hooks */
import AppLayout from "@/layout/AppLayout";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  TextInput,
  Text,
  Radio,
  Flex,
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import axios from "axios";

import { useRouter } from "next/router";
import React, { ReactElement, useRef, useState } from "react";

const index = () => {
  const router = useRouter();
  let ApiEndPoint = router.asPath.split("&");
  const [name, setName] = useState("");
  const [data, setData] = useState({
    Title: "",
    Description: "",
    Questions: [
      {
        Text: "",
        Options: [
          {
            Text: "",
            Id: 1,
          },
        ],
      },
    ],
  });
  const [opened, { open, close }] = useDisclosure(false);
  const [visible, { open: openOver, close: closeOver }] = useDisclosure(false);

  const QuizApiCall = async (url: string) => {
    return axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + ApiEndPoint[1],
        },
      })
      .then((res) => {
        if (res.status === 200) {
          closeOver();
          setData(res.data);
          open();
        }
      });
  };

  return (
    <div>
      {!opened && (
        <Container size={420} pos="relative">
          <LoadingOverlay
            visible={visible}
            zIndex={1000}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              onChange={(e) => setName(e.currentTarget.value)}
              label="Full Name"
              placeholder="Full Name"
              required
              onKeyDown={getHotkeyHandler([
                [
                  "Enter",
                  () => {
                    QuizApiCall(`/api/quiz/start/${ApiEndPoint[2]}`);
                    openOver();
                  },
                ],
              ])}
            />

            <Button
              mt={"md"}
              disabled={name == ""}
              fullWidth
              onClick={() => {
                QuizApiCall(`/api/quiz/start/${ApiEndPoint[2]}`);
                openOver();
              }}
            >
              Start Test
            </Button>
          </Paper>
        </Container>
      )}
      {opened && (
        <Container size={"md"} py={"md"}>
          <Paper withBorder p={"md"} mb={"md"}>
            <Text size="xl">{data?.Title}</Text>
            <Text size="sm">{data?.Description}</Text>
          </Paper>
          {data.Questions.map((item, i) => {
            return (
              <Paper key={i} bg={"gray.1"} mb={"md"} p={"sm"}>
                <Radio.Group label={`${i + 1} )   ${item.Text}`}>
                  <Flex mt="xs" direction={"column"} gap={"xs"}>
                    {item.Options.map((el, i) => {
                      return (
                        <Radio
                          key={i}
                          value={`${el.Id}`}
                          label={el.Text}
                          bg={"white"}
                          p={"xs"}
                        />
                      );
                    })}
                  </Flex>
                </Radio.Group>
              </Paper>
            );
          })}
        </Container>
      )}
    </div>
  );
};

export default index;
