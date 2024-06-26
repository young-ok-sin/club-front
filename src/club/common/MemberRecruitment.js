import { Box, Grid, Button } from "@mui/material";
import ButtonAppBar from "../../common/MainAppBar";
import MemberRecruitmentList from "./MemberRecruitmentList";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import instance from "../../api/instance";
import {
  noticeListState,
  recruitmentListState,
} from "../../recoil/state/noticeState";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useEffect } from "react";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import Cookies from 'js-cookie';
export default function MemberRecruitment() {
  const navigate = useNavigate();

  const [recruitment, setRecruitment] = useRecoilState(recruitmentListState);

  const roleType = Cookies.get("roleType");
  console.log("roleType", roleType);

  useEffect(() => {
    instance
      .get(`/posts/recruitment`)
      .then((response) => {
        const cleanedRecruitList = response?.data.map((recruit) => ({
          ...recruit,
          content: extractTextFromHtml(recruit.content),
        }));
        setRecruitment(cleanedRecruitList);
        console.log("setLatestRecruitList", setRecruitment);
        console.log("cleanedRecruitList", cleanedRecruitList);
      })
      .catch((error) => console.error(error));
  }, []);

  console.log("recruitmentrecruitment", recruitment);
  return (
    <Box sx={{ flexDirection: "column" }}>
      <Box sx={{ width: "100%" }}>
        <ButtonAppBar />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "75px",
          left: "200px",
          right: 0,
          bottom: 0,
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <Grid container direction={"row"} justifyContent={"flex-end"}>
              {roleType == "MASTER" ? (
                <Button
                  variant="outlined"
                  endIcon={<ContentPasteGoIcon />}
                  onClick={() => navigate("/CreateMemberRecruitment")}
                >
                  부원모집 등록
                </Button>
              ) : (
                ""
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} spacing={1}>
            <Grid
              container
              direction={"column"}
              spacing={2}
              justifyContent={"center"}
              alignItems={"center"}
            >
              {recruitment?.map((data) => (
                <Grid item xs={1} key={data.id}>
                  <MemberRecruitmentList recruitment={data} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
function extractTextFromHtml(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const pTags = doc.querySelectorAll("p");
  let extractedText = "";
  pTags.forEach((p) => {
    extractedText += p.textContent + "\n";
  });

  return extractedText.trim();
}
