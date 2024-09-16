// app/api/auth/[...nextauth]/route.js

import { da } from '@faker-js/faker';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const url = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const authOptions = {
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                const response = await fetch(`${url}/user/post/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(credentials),
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    return {
                        id: data.user_id,
                        token: data.token,
                        user_type: data.user_type,
                        email: data.email,
                        mobile_no: data.mobile_no,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        avatar_image: data.avatar_image,
                    };
                } else {
                    throw new Error('Invalid credentials');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.token = user.token;
                token.user_type = user.user_type;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.token = token.token;
            session.user.user_type = token.user_type;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// export default NextAuth(authOptions);
