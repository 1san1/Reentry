import { useState } from "react";
import db, { auth } from "../../firebase";
import { Button } from "@material-ui/core";
import { CommentMenuButton } from "./CommentMenuButton";
import { splitString, isUrl } from "./urlIdentifier";

export function SingleComment(
  { comment, triggerPostRerender, articleId, articleAuthor },
  props
) {
  const [editCommentText, seteditCommentText] = useState("");
  const [openCommentEditInput, setopenCommentEditInput] = useState(false);
  const user = auth.currentUser;
  function getTimeString(comment) {
    const timestamp = comment.timestamp;
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    const date = timestamp.toDate();
    const timeString = date
      .toLocaleDateString(undefined, dateOptions)
      .toString();
    return timeString;
  }

  async function saveEditedComment(commentId) {
    const articleRef = db.collection("articles").doc(articleId);
    const commentsRef = articleRef.collection("comments");
    const commentRef = commentsRef.doc(commentId);
    await commentRef.update({ text: editCommentText, edited: true });
    triggerPostRerender(Math.random());
    setopenCommentEditInput(false);
  }

  async function deleteComment(commentId) {
    const articleRef = db.collection("articles").doc(articleId);
    const commentsRef = articleRef.collection("comments");
    const commentRef = commentsRef.doc(commentId);
    await commentRef.delete();
    triggerPostRerender(Math.random());
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "whitesmoke",
          padding: "10px",
          margin: "5px 15px 5px 15px",
          borderRadius: "10px",
        }}
        key={comment.timestamp}
      >
        <div>
          <img
            src={
              comment.commenterProfilePic
                ? comment.commenterProfilePic
                : "./images/user.svg"
            }
            alt="commenter profile picture"
            width="44px"
            height="40px"
            style={{ marginRight: "10px", borderRadius: "5px" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {openCommentEditInput && comment.commenterUid === user.uid ? (
            <>
              <textarea
                style={{ width: "100%" }}
                type="text"
                value={editCommentText}
                onChange={(e) => seteditCommentText(e.target.value)}
              />
            </>
          ) : (
            <section>
              <p style={{ textAlign: "left", fontSize: "0.8em" }}>
                {comment.postedBy}
              </p>
              <p style={{ textAlign: "left", fontSize: "0.7em" }}>
                {(() => {
                  const res = splitString(comment.text).map((str) =>
                    isUrl(str) ? (
                      <a href={str} target="_blank">
                        {str}
                      </a>
                    ) : (
                      str
                    )
                  );
                  return res;
                })()}
              </p>
              <p style={{ textAlign: "left", fontSize: "0.5em" }}>
                {getTimeString(comment)}
              </p>
            </section>
          )}

          {comment.commenterUid === user.uid || articleAuthor === user.uid ? (
            !openCommentEditInput ? (
              <section>
                <CommentMenuButton
                  initateCommentEdit={setopenCommentEditInput}
                  seteditCommentText={seteditCommentText}
                  commentText={comment.text}
                  deleteComment={deleteComment}
                  commentId={comment.id}
                  allowEdit={comment.commenterUid === user.uid}
                />
              </section>
            ) : (
              <div>
                <Button
                  size="small"
                  onClick={() => saveEditedComment(comment.id)}
                >
                  Save
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setopenCommentEditInput(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
