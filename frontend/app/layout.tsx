import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-light">{children}</body>
    </html>
  );
}
