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
  Grid,
  Box,
  Title,
} from "@mantine/core";
import { getHotkeyHandler, useDisclosure } from "@mantine/hooks";
import axios from "axios";

import { useRouter } from "next/router";
import React, { useState } from "react";

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
  const [option, setOption] = useState<any>([]);
  const [result, setResult] = useState({
    status: false,
    data: {
      score: 0,
    },
  });

  const QuizApiCall = async (url: string) => {
    return axios
      .get(url, {
        headers: {
          Authorization: "Bearer " + ApiEndPoint[2],
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

  const AddOption = ({ questionId, optionId }: any) => {
    if (option.length == 0 && optionId != undefined) {
      setOption([{ questionId: questionId, optionId: Number(optionId) }]);
    } else {
      option.forEach((el: any) => {
        if (el.questionId == questionId && optionId != undefined) {
          el.optionId = Number(optionId);
        }
      });
      let a = option.find((fin: any) => fin.questionId == questionId);
      if (a == undefined && optionId != undefined) {
        setOption([
          ...option,
          { questionId: questionId, optionId: Number(optionId) },
        ]);
      }
    }
  };

  const ResultQuiz = () => {
    let config = {
      headers: {
        Authorization: "Bearer " + ApiEndPoint[2],
      },
    };
    axios
      .post(
        `api/Results?UserId=${ApiEndPoint[1]}&QuizId=${ApiEndPoint[3]}`,
        option,
        config
      )
      .then(function (response) {
        console.log(response);

        if (response.status == 200) {
          setResult({ status: true, data: response.data });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      {result.status ? (
        <Container size={420} mt={"xl"}>
          <Paper withBorder p={"md"} mb={"md"} bg={"teal.4"}>
            <Title order={2} ta={"center"} c="gray.1">
              Your results
            </Title>
            <Title order={1} c={"#fff"} ta={"center"}>
              {result?.data.score}
            </Title>
          </Paper>
        </Container>
      ) : (
        <>
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
                        QuizApiCall(`/api/quiz/start/${ApiEndPoint[3]}`);
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
                    QuizApiCall(`/api/quiz/start/${ApiEndPoint[3]}`);
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
                <Flex gap={"md"} justify={"space-between"}>
                  <Box>
                    <Text size="xl">{data?.Title}</Text>
                    <Text size="sm">{data?.Description}</Text>
                  </Box>{" "}
                  <Text size="xl">
                    {option.length}/{data?.Questions.length}
                  </Text>
                </Flex>
              </Paper>
              {data.Questions.map((item: any, i) => {
                return (
                  <Paper key={i} bg={"gray.1"} mb={"md"} p={"sm"}>
                    <Radio.Group
                      label={`${i + 1} )   ${item.Text}`}
                      onClick={(val: any) =>
                        AddOption({
                          questionId: item.Id,
                          optionId: val.target.value,
                        })
                      }
                    >
                      <Flex mt="xs" direction={"column"} gap={"xs"}>
                        {item.Options.map((el: any, i: number) => {
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
              <Button
                onClick={ResultQuiz}
                fullWidth
                disabled={data.Questions.length != option.length}
              >
                Submit
              </Button>
            </Container>
          )}
        </>
      )}
    </div>
  );
};

export default index;
