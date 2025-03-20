import React from 'react';
import { Link } from 'react-router-dom';
import defaultImage from '../../assets/default-post.jpg';
import getImagePath from '../../utils/imagePaths';

const PostCard = ({ post }) => {
  const { author, content, image, likes, comments, timestamp } = post;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${author.role}/${author.id}`} className="post-author">
          <div className="avatar">
            <img 
              src={getImagePath(author.avatar) || defaultImage} 
              alt={author.name} 
              onError={handleImageError}
            />
          </div>
          <div className="author-info">
            <h4>{author.name}</h4>
            <span className="role-badge">{author.role}</span>
          </div>
        </Link>
        <div className="post-date">
          {formatDate(timestamp)}
        </div>
      </div>
      
      <div className="post-content">
        <p>{content}</p>
        {image && (
          <div className="post-image">
            <img 
              src={getImagePath(image)} 
              alt="Post content" 
              onError={handleImageError}
            />
          </div>
        )}
      </div>
      
      <div className="post-actions">
        <button className="action-btn">
          <i className="far fa-heart"></i> {likes}
        </button>
        <button className="action-btn">
          <i className="far fa-comment"></i> {comments}
        </button>
        <button className="action-btn">
          <i className="far fa-share-square"></i>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
