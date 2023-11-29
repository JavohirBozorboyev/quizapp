import AppLayout from "@/layout/AppLayout";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
  Box,
  Progress,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useInputState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text component="div" c={meets ? "teal" : "red"} mt={5} size="sm">
      <Center inline>
        {meets ? (
          <IconCheck size="0.9rem" stroke={1.5} />
        ) : (
          <IconX size="0.9rem" stroke={1.5} />
        )}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
}

export default function Signup() {
  const [value, setValue] = useInputState("");
  const strength = getStrength(value);
  const router = useRouter();
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));
  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        styles={{ section: { transitionDuration: "0ms" } }}
        value={
          value.length > 0 && index === 0
            ? 100
            : strength >= ((index + 1) / 4) * 100
            ? 100
            : 0
        }
        color={strength > 80 ? "teal" : strength > 50 ? "yellow" : "red"}
        key={index}
        size={4}
      />
    ));
  const form = useForm({
    initialValues: { name: "", email: "", password: "" },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must have at least 2 letters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const Register = () => {
    if (strength == 100) {
      axios
        .post("/api/Auth/register", {
          fullName: form.values.name,
          email: form.values.email,
          password: value,
        })
        .then(function (response) {
          if (response.status == 201) {
            notifications.show({
              withCloseButton: true,
              autoClose: 10000,
              title: "Ro'yhatdan o'tdingiz",
              message: "Tizimga kirish uchun malumotlarni qayta kiriting!",
              withBorder: true,
              loading: false,
            });
            router.push("/auth/signin");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  return (
    <Container size={420} my={40}>
      <Title ta="center">Register</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Link href={"/auth/signin"}>
          <Anchor size="sm" component="button">
            Signin
          </Anchor>
        </Link>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(Register)}>
          <TextInput
            label="Name"
            placeholder="Name"
            {...form.getInputProps("name")}
          />
          <TextInput
            mt="sm"
            label="Email"
            placeholder="Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            value={value}
            onChange={setValue}
            placeholder="Your password"
            label="Password"
            required={false}
            mt={"md"}
          />

          <Group gap={5} grow mt="md" mb="md">
            {bars}
          </Group>

          {/* <PasswordRequirement
            label="Has at least 6 characters"
            meets={value.length > 5}
          /> */}
          {/* {checks} */}
          {/* <PasswordInput
            mt="sm"
            label="Password"
            placeholder="password"
            {...form.getInputProps("password")}
          /> */}
          <Button fullWidth type="submit" mt="sm">
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

Signup.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};
