import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import PostCard from '../components/posts/PostCard';
import StartupCard from '../components/startup/StartupCard';
import InvestorCard from '../components/investor/InvestorCard';
import './ForYouPage.css';

// Dummy data for posts
const dummyPosts = [
  {
    id: 1,
    type: 'post',
    author: {
      id: 101,
      name: 'TechInnovate',
      role: 'startup',
      avatar: '/images/avatars/startup1.jpg'
    },
    content: 'Excited to announce our new AI-powered platform that helps businesses automate customer support!',
    image: '/images/posts/tech-post.jpg',
    likes: 42,
    comments: 8,
    timestamp: '2025-03-18T14:30:00'
  },
  {
    id: 2,
    type: 'post',
    author: {
      id: 102,
      name: 'GreenEnergy Solutions',
      role: 'startup',
      avatar: '/images/avatars/startup2.jpg'
    },
    content: 'Our renewable energy solution has just reached a milestone of powering 10,000 homes across Southeast Asia!',
    image: '/images/posts/green-energy.jpg',
    likes: 78,
    comments: 15,
    timestamp: '2025-03-17T09:15:00'
  },
  {
    id: 3,
    type: 'post',
    author: {
      id: 201,
      name: 'Asia Ventures',
      role: 'investor',
      avatar: '/images/avatars/investor1.jpg'
    },
    content: "Looking for innovative startups in the healthcare space. If you're revolutionizing healthcare in APAC, let's connect!",
    image: null,
    likes: 35,
    comments: 12,
    timestamp: '2025-03-16T16:45:00'
  },
  {
    id: 4,
    type: 'startup',
    profile: {
      id: 103,
      name: 'FinTech Solutions',
      avatar: '/images/avatars/startup3.jpg',
      industry: 'Fintech',
      location: 'Singapore',
      description: 'Revolutionizing financial services with blockchain technology',
      fundingNeeded: 500000
    }
  },
  {
    id: 5,
    type: 'investor',
    profile: {
      id: 202,
      name: 'Tech Growth Capital',
      avatar: '/images/avatars/investor2.jpg',
      focus: 'Technology, SaaS, AI',
      location: 'Hong Kong',
      description: 'Early-stage investor focusing on disruptive technologies',
      investmentRange: '$500K - $2M'
    }
  },
  {
    id: 6,
    type: 'post',
    author: {
      id: 104,
      name: 'EduTech Innovators',
      role: 'startup',
      avatar: '/images/avatars/startup4.jpg'
    },
    content: 'Our education platform has just surpassed 1 million users across APAC! Thanks to all our supporters.',
    image: '/images/posts/edutech.jpg',
    likes: 92,
    comments: 24,
    timestamp: '2025-03-15T11:20:00'
  }
];

const ForYouPage = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real app, you would fetch posts from an API
    // For now, we'll use the dummy data
    setTimeout(() => {
      setPosts(dummyPosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'startups' && (post.type === 'startup' || (post.type === 'post' && post.author.role === 'startup'))) return true;
    if (filter === 'investors' && (post.type === 'investor' || (post.type === 'post' && post.author.role === 'investor'))) return true;
    return false;
  });

  const renderContent = (item) => {
    switch (item.type) {
      case 'post':
        return <PostCard post={item} />;
      case 'startup':
        return <StartupCard startup={item.profile} />;
      case 'investor':
        return <InvestorCard investor={item.profile} />;
      default:
        return null;
    }
  };

  return (
    <div className="for-you-page">
      <div className="card">
        <h1 className="large text-primary">For You</h1>
        <p className="lead">
          <i className="fas fa-stream"></i> Discover content tailored for you
        </p>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'startups' ? 'active' : ''}`}
            onClick={() => setFilter('startups')}
          >
            Startups
          </button>
          <button 
            className={`filter-tab ${filter === 'investors' ? 'active' : ''}`}
            onClick={() => setFilter('investors')}
          >
            Investors
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner">Loading content...</div>
        ) : (
          <div className="content-feed">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(item => (
                <div key={item.id} className="feed-item">
                  {renderContent(item)}
                </div>
              ))
            ) : (
              <p>No content found for this filter.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForYouPage;
