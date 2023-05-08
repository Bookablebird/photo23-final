import { getPosts, deletePost } from '@lib/firebase'
import { Layout } from '@components'
import { useAuth } from '@contexts/auth'
import { useRouter } from 'next/router'
import { useState } from 'react'


import * as React from 'react'
//import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Collapse from '@mui/material/Collapse'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import Tooltip from '@mui/material/Tooltip'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import AspectRatio from '@mui/joy/AspectRatio'
import Paper from '@mui/material/Paper'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'




const HomePage = ({ posts }) => {
  const router = useRouter() // this is new

  const [user, userLoading] = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const [selected, setSelected] = useState(null)

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget)
    console.log(e)
  }

  const handleDelete = (Id) => {
    const shouldDeletePost = confirm(
      'Are you sure you want to delete this post?',
    )
    if (shouldDeletePost) {
      deletePost(Id).then(() => {
        router.push('/')
        setAnchorEl(null)
      })
    }

  }
  const handleEdit = (Id) => {
    router.push(`/edit/${Id}`)
  }

console.log(user)
  if (userLoading) {
    return null
  }
  
  if (!user && typeof window !== 'undefined') {
    router.push('/signin')
    return null
  }
  console.log(posts)

  const menuId = 'primary-search-account-menu'
  const renderMenu =  (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleDelete(selected)}>Delete</MenuItem>
      <MenuItem onClick={() => handleEdit(selected)}>Edit</MenuItem>
    </Menu>
  )
      const select = (id) => {
        setSelected(id)
        console.log(selected)
      }

return (
  //säädä maxwidth -> maxheight
    <Layout>
      <div>
        {posts.map((post) => (    
    <Card sx={{ maxWidth: "50%", margin: "auto", marginTop: 5, backgroundColor: "#fafafa"}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            user
          </Avatar>
        }
        action={
          <IconButton 
          aria-label="settings"
          onClick={(e) => { handleProfileMenuOpen(e); select(post.Id) }}
          aria-controls={menuId}
          aria-haspopup="true"
          >
            <MoreVertIcon />
          </IconButton>
        }
        key={post.Id}
        subheader={post.User}
      />
      <CardActionArea href={`/post/${post.Id}`}>
      <AspectRatio objectFit="contain" variant="plain">
      <CardMedia
        component="img"
        image={post.coverImage}
      />
      </AspectRatio>
      </CardActionArea>
      <CardContent>
        <Typography variant="body2">
          {new Date(post.dateCreated).toLocaleString()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {post.title}
        </Typography>
      </CardContent>
      {renderMenu}
    </Card>
        ))}
    </div>
      <Tooltip title="Add a new photo to your profile.">
        <IconButton 
        href="/create" 
        sx={{ width: 70, height: 70, flexGrow: 1, position: 'fixed', bottom: 20, right: 20, backgroundColor: 'lightgray', opacity: .5  }}>
          <SpeedDialIcon />
        </IconButton>
        </Tooltip>      
    </Layout>
  )
}

export async function getServerSideProps() {
  const posts = await getPosts()

  return {
    props: {
      posts,
    },
  }
}

export default HomePage