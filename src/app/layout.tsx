import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import './globals.css';

const orbitron = Orbitron({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'Blue Vending Machine',
  description:
    'A modern vending machine application built with Next.js and Ant Design',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'var(--font-orbitron), sans-serif',
              },
              components: {
                Button: {
                  controlHeight: 40,
                  fontSize: 16,
                },
                Card: {
                  borderRadiusLG: 16,
                  bodyPadding: 20,
                },
              },
            }}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
