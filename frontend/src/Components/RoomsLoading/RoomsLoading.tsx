import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RoomsLoading: React.FC = () => {
  const result = () => {
    const skeletons = [];
    for (let i = 0; i < 10; i++) {
      skeletons.push(
        <div key={i} className="h-[300px]">
          <Skeleton
            count={1}
            baseColor="#666666"
            className="mb-8"
            width="70%"
            height={40}
          />
          <Skeleton count={1} baseColor="#888888" width="90%" />
          <Skeleton count={2} baseColor="#888888" width="70%" />
          <Skeleton count={1} baseColor="#888888" width="50%" />
          <Skeleton count={1} baseColor="#888888" width="80%" />
          <Skeleton count={1} baseColor="#888888" width="40%" />
          <Skeleton count={1} baseColor="#888888" width="70%" />
        </div>
      );
    }
    return skeletons;
  };

  return <>{result()}</>;
};

export default RoomsLoading;
