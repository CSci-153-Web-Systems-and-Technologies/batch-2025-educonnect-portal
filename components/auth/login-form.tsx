"use client"; // Add this line if it's missing
import * as React from 'react'; // Ensure React is imported
import { useRouter } from 'next/navigation'; // Import for redirection
import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const router = useRouter(); // Initialize router

  const handleLogin = async (e: React.FormEvent) => { // Use React.FormEvent
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      // Supabase error handling
      setError(loginError.message);
    } else {
      // Success: Redirect to the assignments page (your dashboard)
      router.push('/dashboard/teacher'); 
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">EduConnect Portal</CardTitle> 
          <CardDescription>
            Please log in to access your EduConnect Portal Account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}> {/* Attach handler to form */}
            <FieldGroup>
              
              {/* Removed social media buttons for simplicity, but you can add Supabase OAuth here */}

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher/parent@gmail.com"
                  value={email} // Controlled input
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} // Controlled input
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </Field>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'} {/* Disable button while loading */}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}