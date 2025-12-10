import style from "./CommentSection.module.css";
import CommentForm from "../CommentForm/CommentForm";
import { formatDate } from "../../utils/formatDate";
import { useComments } from "../../hooks/useComments/useComments";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

/**
 * This is the comment section component that is to be used in the single
 * recipe page.
 *
 * If user have written comments before previous name is loaded from
 * session storage and into the input field
 *
 * TODO: As of now this use mock data and does not write to the data stored.
 * This logic will be implemented when the GraphQL database is up.
 * @returns Comment section
 */

function CommentSection({ recipeId }: { recipeId: string }) {
  //states that keep all comments, error and
  const { comments, isLoading, isError, submitComment } = useComments(recipeId);

  if (isError) {
    console.error("Comments could not be loaded");
    return <ErrorMessage />;
  }

  return (
    <div
      className={style.comment_section}
      role="region"
      aria-labelledby="comment-section-title"
    >
      <h2 id="comment-section-title">Comment section</h2>

      <CommentForm commentUpdate={submitComment} />

      <section
        className={style.comment_container}
        aria-live="polite"
        aria-relevant="additions"
        aria-label="All comments"
      >
        <h3>All comments</h3>

        {comments.length === 0 && (
          <p role="status" aria-live="polite">
            No comments yet. Be the first to comment!
          </p>
        )}

        {isLoading && (
          <p role="status" aria-live="polite">
            Loading ...
          </p>
        )}

        {comments.map((comment, index) => {
          // AI GEN: Accessibility fix to ensure heading always has visible text
          const displayName =
            comment.anonymousName && comment.anonymousName.trim().length > 0
              ? comment.anonymousName
              : "Anonymous";

          return (
            <article
              className={style.comment}
              key={displayName + "-" + index}
              aria-label={`Comment by ${displayName}`}
            >
              <header className={style.comment_header_container}>
                <h4>{displayName}</h4>

                <p className={style.comment_date}>
                  <time dateTime={comment.date}>
                    {formatDate(comment.date)}
                  </time>
                </p>
              </header>

              <p>{comment.comment}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default CommentSection;
