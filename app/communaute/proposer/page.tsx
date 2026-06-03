import { redirect } from 'next/navigation'

// Cette URL est conservée pour la rétro-compatibilité
export default function ProposerRedirect() {
  redirect('/communaute#proposer')
}
