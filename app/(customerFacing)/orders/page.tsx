"use client"

import { emailOrderHistory } from "@/actions/orders"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"
import { Resend } from 'resend';


type FormState = {
  error: any
  message: any
  email: string;
};


export default function MyOrdersPage() {
  const resend = new Resend(process.env.RESEND_API_KEY as string);
  const initialState: FormState = {
    email: '',
    error: '',
    message: ''
  }; // Customize this based on your form structure

  // Use the useFormState with the required initial state and action
  const [data, action, isPending] = useFormState<FormState, FormData>(
    async (prevState, formData) => {
      const result = await emailOrderHistory(prevState, formData, resend);
      return { ...prevState, ...result }; // Return the new state based on the result
    },
    initialState
  );

  return (
    <form action={action} className="max-2-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>
            Enter your email and we will email you your order history and
            download links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" required name="email" id="email" />
            {data.error && <div className="text-destructive">{data.error}</div>}
          </div>
        </CardContent>
        <CardFooter>
          {data.message ? <p>{data.message}</p> : <SubmitButton />}
        </CardFooter>
      </Card>
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button className="w-full" size="lg" disabled={pending} type="submit">
      {pending ? "Sending..." : "Send"}
    </Button>
  )
}