import { Card, Text, Button, Group, ActionIcon, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { getCookie } from "cookies-next";
import Link from "next/link";
import React from "react";

type Props = { data: any };

const DashbaordQuizCard = ({ data }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  let token = getCookie("token");
  const Delete = (id: number) => {
    let config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    axios
      .delete(
        `/api/quiz/${id}`,

        config
      )
      .then(function (response) {
        if (response.status == 204) {
          close();

          notifications.show({
            message: "Quiz has been deleted",
            withBorder: true,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <Card padding="sm" withBorder>
        <Text fw={500} size="lg">
          {data.title}
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          {data.description}
        </Text>
        <Group align="center" mt={"sm"}>
          <ActionIcon variant="light" color="red" size={"lg"} onClick={open}>
            <IconTrash size={"18px"} />
          </ActionIcon>
          <Link href={`/dashboard/${data.id}`}>
            <Button fullWidth variant="light">
              Read More
            </Button>
          </Link>
        </Group>
      </Card>
      <Modal opened={opened} onClose={close} title="Delete Quiz">
        <Text fw={500} size="lg">
          {data.title}
        </Text>

        <Text mt="xs" c="dimmed" size="sm">
          {data.description}
        </Text>
        <Button fullWidth color="red" mt={"md"} onClick={() => Delete(data.id)}>
          Delete
        </Button>
      </Modal>
    </div>
  );
};

export default DashbaordQuizCard;
