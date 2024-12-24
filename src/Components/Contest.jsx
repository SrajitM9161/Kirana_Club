import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Spinner, Card, Button } from '@shopify/polaris';
import { fetchContests } from '../api'; 

const ContestDetails = () => {
  const { contest_id } = useParams(); 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState(null);

  useEffect(() => {
    const getContestDetails = async () => {
      try {
        const contests = await fetchContests();
        const contestData = contests.find((contest) => contest.id === Number(contest_id));

        if (contestData) {
          setContest({
            id: contestData.id,
            name: contestData.name,
            type: contestData.type,
            phase: contestData.phase,
            startTime: new Date(contestData.startTimeSeconds * 1000).toLocaleString(),
            description: contestData.description || 'No description available.', 
          });
        }
      } catch (error) {
        console.error('Error fetching contest details:', error);
      } finally {
        setLoading(false);
      }
    };

    getContestDetails();
  }, [contest_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Contest not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card title="Contest Details">
        <div className="p-4 space-y-4">
          <p><strong>ID:</strong> {contest.id}</p>
          <p><strong>Name:</strong> {contest.name}</p>
          <p><strong>Type:</strong> {contest.type}</p>
          <p><strong>Phase:</strong> {contest.phase}</p>
          <p><strong>Start Time:</strong> {contest.startTime}</p>
          <p><strong>Description:</strong> {contest.description}</p>
          <Button onClick={() => navigate('/table')} plain>Back to Table</Button>
        </div>
      </Card>
    </div>
  );
};

export default ContestDetails;
