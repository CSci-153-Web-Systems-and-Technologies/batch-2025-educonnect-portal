export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nested layouts should not render <html> or <body>.
  return children;
}
