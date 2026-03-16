import { useState } from 'react';
import { useForgotPasswordMutation } from '../mutations/useForgotPasswordMutation';

export function useForgotPasswordHook() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { mutate: sendResetLink, isPending } = useForgotPasswordMutation(() => {
    setSent(true);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendResetLink(email);
  };

  return { email, setEmail, sent, isPending, handleSubmit };
}
