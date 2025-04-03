"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";

const SigninSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address format" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password cannot exceed 100 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["caretaker", "doctor"]),
});

export default function SignIn() {
  const router = useRouter();

  const form = useForm<z.infer<typeof SigninSchema>>({
    resolver: zodResolver(SigninSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "caretaker",
    },
  });

  const role = form.watch("role");

  async function onSubmit(data: z.infer<typeof SigninSchema>) {
    try {
      const endpoint =
        role === "caretaker"
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/caretaker/signin`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/doctor/signin`;

      const response = await axios.post(endpoint, data);

      // Validate response data structure
      if (role === "doctor" && !response.data.doctor) {
        throw new Error("Invalid response: Missing doctor data");
      }
      if (role === "caretaker" && !response.data.caretaker) {
        throw new Error("Invalid response: Missing caretaker data");
      }

      // Store user data in localStorage with proper role handling
      const userData = {
        id: role === "caretaker" ? response.data.caretaker.id : response.data.doctor.id,
        email: role === "caretaker" ? response.data.caretaker.email : response.data.doctor.email,
        name: role === "caretaker" ? response.data.caretaker.name : response.data.doctor.name,
        role: role,
      };

      // Validate user data before storing
      if (!userData.id || !userData.email) {
        throw new Error("Invalid user data received from server");
      }

      localStorage.setItem("user", JSON.stringify(userData));
      
      // Redirect based on role
      router.push(role === "caretaker" ? "/caretaker" : "/doctor");
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.status === 400) {
        const validationErrors = error.response.data.details;
        const errorMessages = Object.entries(validationErrors)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
          .join("\n");
        toast.error(`Validation errors:\n${errorMessages}`);
      } else {
        toast.error(error.message || "Something went wrong. Please try again.");
      }
      console.error("Signin error:", error);
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google OAuth here
    toast("Redirecting to Google login...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-teal-600">Saanjh Sahayak</h1>
        </div>

        <Card className="border-0 shadow-lg mt-6">
          <CardHeader className="text-center">
            <h2 className="text-xl font-semibold">Sign In</h2>
            <p className="text-gray-600 mt-1">Access your account</p>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <Tabs
                  defaultValue="caretaker"
                  className="w-full"
                  onValueChange={(value) =>
                    form.setValue("role", value as "caretaker" | "doctor")
                  }
                  value={role}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="caretaker">Caretaker</TabsTrigger>
                    <TabsTrigger value="doctor">Doctor</TabsTrigger>
                  </TabsList>
                </Tabs>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      {/* <div className="flex justify-end">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-teal-600 hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                {/* <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div> */}

                {/* <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle />
                  Sign in with Google
                </Button> */}
              </CardContent>

              <CardFooter className="flex flex-col">
                <p className="mt-4 text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}