import React from 'react';
import { Navigate } from 'react-router-dom';

export default function NotFound() {
  // Option 1: Redirect to home
  return <Navigate to="/" replace />;
  
  // Option 2: Display a 404 page
  // return (
  //   <div>
  //     <h1>Page Not Found</h1>
  //     <p>The page you're looking for doesn't exist.</p>
  //   </div>
  // );
}