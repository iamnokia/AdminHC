import React, { useState } from "react";
import { Box, Card, Typography, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite"; // Importing the heart icon
import GOLDEN from "../assets/icons/Golden.jpeg"; // Using your existing import

const CardCustomAll = () => {
  const [liked, setLiked] = useState(false); // State for like button

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          height: "220px",
          backgroundImage: `url(${GOLDEN})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
        }}
      />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#00483c",
            fontSize: "1.2rem",
            mb: 1,
          }}
        >
          Dogs can also get cold
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#333",
            mb: 2,
            lineHeight: 1.4,
            whiteSpace: "normal",
            display: "block",
            overflow: "visible",
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos maxime
          quia alias, labore aut quidem, corrupti repudiandae atque eaque nulla
          at nihil! Non aspernatur magni veniam aperiam, numquam quas optio.
        </Typography>

        {/* Like Button Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="caption" sx={{ color: "#666" }}>
            6 Jun 2023
          </Typography>

          <IconButton
            onClick={() => setLiked(!liked)}
            sx={{ color: liked ? "red" : "gray" }} // Changes color when liked
          >
            <FavoriteIcon />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CardCustomAll;
