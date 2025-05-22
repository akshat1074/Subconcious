import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import React from 'react';
interface CardProps {
    title: string;
    link: string;
    type: 'youtube' | 'twitter' | 'other';
  }
  
  // Function to extract YouTube video ID from various URL formats
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?m\.youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    return null;
  };
  
  // Function to create YouTube embed URL
  const createYouTubeEmbedUrl = (videoId: string): string => {
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
  };
  
  // Function to validate and convert YouTube URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? createYouTubeEmbedUrl(videoId) : null;
  };
  
  const Card: React.FC<CardProps> = ({ title, link, type }) => {
    return (
      <div className=" w-72  h-72 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-center justify-between ">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center text-gray-500">
            <ShareIcon/>
          </div>
        </div>
  
        {/* Content based on type */}
        <div className="pt-20">
          {type === "youtube" && (() => {
            const embedUrl = getYouTubeEmbedUrl(link);
            
            if (!embedUrl) {
              return (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">
                    Invalid YouTube URL. Please check the link format.
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    Original URL: {link}
                  </p>
                </div>
              );
            }
  
            return (
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            );
          })()}
  
          {type === "twitter" && (
            <blockquote className="twitter-tweet bg-gray-50 p-4 rounded-lg border-l-4 border-blue-400">
              <a 
                href={link.replace("x.com", "twitter.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View Tweet
              </a>
            </blockquote>
          )}
  
          {type === "other" && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <a 
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {link}
              </a>
            </div>
          )}
        </div>
        
      </div>
    );
  };
  
  export default Card;