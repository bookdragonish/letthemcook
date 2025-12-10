import { useEffect, useState } from "react";
import style from "./CommentForm.module.css";
import type { Comment } from "../../types/comment";

interface CommentFormProps {
  // Pure submit function from the hook
  commentUpdate: (
    anonymousName: string,
    comment: string
  ) => Promise<void> | void;
}

function CommentForm({ commentUpdate }: CommentFormProps) {
  const [formData, setFormData] = useState<Comment>({
    anonymousName: "",
    comment: "",
    date: "",
  });

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Husk anonymt navn fra sessionStorage
  useEffect(() => {
    const loadedName = sessionStorage.getItem("anonymousName");
    if (loadedName) {
      setFormData({ anonymousName: loadedName, comment: "", date: "" });
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setAttemptedSubmit(true);

    if (!formData.anonymousName.trim() || !formData.comment.trim()) return;

    await commentUpdate(formData.anonymousName, formData.comment);

    // Oppdater anonymt navn i sessionStorage
    sessionStorage.setItem("anonymousName", formData.anonymousName);

    // Fjern kun kommentaren etter posting
    setFormData((prev) => ({ ...prev, comment: "" }));
    setAttemptedSubmit(false);
  };

  const nameInvalid = attemptedSubmit && !formData.anonymousName.trim();
  const commentInvalid = attemptedSubmit && !formData.comment.trim();

  return (
    <section>
      <form className={style.form} onSubmit={handleSubmit}>
        <span>
          <label htmlFor="name">Name:</label>
        </span>
        <input
          type="text"
          id="name"
          placeholder="anonymous name"
          value={formData.anonymousName}
          maxLength={25}
          onChange={(e) =>
            setFormData({ ...formData, anonymousName: e.target.value })
          }
          aria-required="true"
          aria-invalid={nameInvalid}
          aria-describedby="name-help"
        />
        <span id="name-help" className={style.name_help}>
          Max 25 characters
        </span>

        {/* NEW FEEDBACK MESSAGE */}
        {nameInvalid && (
          <p className={style.validationError} role="alert">
            Name is required.
          </p>
        )}

        <span>
          <label htmlFor="comment">Comment:</label>
        </span>
        <textarea
          id="comment"
          placeholder="comment..."
          value={formData.comment}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
            setFormData({ ...formData, comment: target.value });
          }}
          aria-required="true"
          aria-invalid={commentInvalid}
          aria-describedby="comment-help"
        />
        {/* NEW FEEDBACK MESSAGE */}
        {commentInvalid && (
          <p className={style.validationError} role="alert">
            Comment cannot be empty.
          </p>
        )}
        <span id="comment-help" className={style.comment_help}>
          Your comment will be added to the recipe
        </span>

        <button type="submit" className={style.post}>
          Post
        </button>
      </form>
    </section>
  );
}

export default CommentForm;
