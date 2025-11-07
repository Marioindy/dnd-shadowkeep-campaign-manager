import LoginForm from './components/LoginForm';

/**
 * Renders the centered login page layout with a gradient background, the title "Shadowkeep", a subtitle, and the LoginForm component.
 *
 * @returns The page JSX element displaying the login interface.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Shadowkeep
          </h1>
          <p className="text-gray-400">Login to your campaign</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}