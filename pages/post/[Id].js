import { deletePost, getPostBySlug } from '@lib/firebase'
import styles from '@styles/post.module.scss'
import { getFormattedDate } from '@lib/utils'
import { useRouter } from 'next/router'
import { Icon, Layout } from '@components'
import { useAuth } from '@contexts/auth'


export async function getServerSideProps(title) {
  const post = await getPostBySlug(title.query.Id)

  return {
    props: {
      post,
    },
  }
}

const PostPage = ({ post }) => {
  const router = useRouter()
  const [user] = useAuth()

  if (!post && typeof window !== 'undefined') {
    router.push('/404')
    return
  }

  if (!post) {
    return null
  }

  return (
    <Layout>
      <div className={styles.PostPage}>
        <img src={post.coverImage} />
        <div>
          <h1>{post.title}</h1>
          {user && (
            <span>
            <a href={`/edit/${post.Id}`}>
              <Icon name="pencil-alt" />
            </a>
            <button
              onClick={() => {
                const shouldDeletePost = confirm(
                  'Are you sure you want to delete this post?',
                )
                if (shouldDeletePost) {
                  deletePost(post.Id).then(() => {
                    router.push('/')
                  })
                }
              }}
            >
              <Icon name="trash-alt" />
            </button>
          </span>
          )}
        </div>
        <span>Published {getFormattedDate(post.dateCreated)}</span>
        <p dangerouslySetInnerHTML={{ __html: post.title }}></p>
      </div>
    </Layout>
  )
}

export default PostPage