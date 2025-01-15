
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <header>
            <h1>Posts App</h1>
          </header>
          <main>{children}</main>
          <footer>
            <p>© 2025 Posts App</p>
          </footer>
        </div>
      </body>
    </html>
  );
}