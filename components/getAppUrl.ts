export default function () {
  const branchUrl = process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,
    isMaster = branchUrl?.includes('-git-master-'),
    domain = isMaster ? 'mesaidesreno.beta.gouv.fr' : branchUrl
  const urlBase =
    process.env.NEXT_PUBLIC_NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'https://' + domain
  return urlBase
}
