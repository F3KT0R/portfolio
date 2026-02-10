import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

export async function renderMdx(source: string) {
  return (
    <MDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
      components={{
        a: (props) => (
          <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" />
        ),
      }}
    />
  )
}
