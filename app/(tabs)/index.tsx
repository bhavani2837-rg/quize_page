import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

/* ---------- TYPES ---------- */
type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
};

/* ---------- DUMMY DATA (UI ONLY) ---------- */
const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Who was the first Governor-General of India?",
    options: [
      "Lord Mountbatten",
      "Warren Hastings",
      "Lord Dalhousie",
      "Lord Curzon",
    ],
    correctIndex: 1,
    marks: 1,
  },
  {
    id: 2,
    question:
      "Fundamental Rights are mentioned in which part of the Constitution?",
    options: ["Part II", "Part III", "Part IV", "Part V"],
    correctIndex: 1,
    marks: 1,
  },
];

/* ---------- APP ---------- */
export default function App() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectOption = (qId: number, index: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: index });
  };

  const submitQuiz = () => {
    setSubmitted(true);
  };

  const restartQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const totalMarks = QUESTIONS.reduce((s, q) => s + q.marks, 0);
  const obtainedMarks = QUESTIONS.reduce(
    (s, q) => (answers[q.id] === q.correctIndex ? s + q.marks : s),
    0
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* HEADER */}
        <Text style={styles.title}>Bodha UPSC – Daily Quiz</Text>

        {/* QUESTIONS */}
        {QUESTIONS.map((q) => (
          <View key={q.id} style={styles.card}>
            <View style={styles.qHeader}>
              <Text style={styles.question}>
                Q{q.id}. {q.question}
              </Text>
              <Text style={styles.mark}>{q.marks} Mark</Text>
            </View>

            {q.options.map((opt, idx) => {
              const selected = answers[q.id] === idx;
              const isCorrect = idx === q.correctIndex;

              let optionStyle = styles.option;

              if (submitted) {
                if (isCorrect) optionStyle = styles.correct;
                else if (selected) optionStyle = styles.wrong;
              } else if (selected) {
                optionStyle = styles.selected;
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={optionStyle}
                  onPress={() => selectOption(q.id, idx)}
                >
                  <Text>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {/* ANSWER REVIEW */}
            {submitted && (
              <Text style={styles.reviewText}>
                {answers[q.id] === q.correctIndex
                  ? `✔ Correct · +${q.marks} Mark`
                  : `✖ Incorrect · Correct Answer: Option ${String.fromCharCode(
                      65 + q.correctIndex
                    )} · Marks: 0`}
              </Text>
            )}
          </View>
        ))}

        {/* SUBMIT BUTTON */}
        {!submitted && (
          <TouchableOpacity style={styles.submitBtn} onPress={submitQuiz}>
            <Text style={styles.btnText}>Submit Quiz</Text>
          </TouchableOpacity>
        )}

        {/* TOTAL + RESTART */}
        {submitted && (
          <>
            <Text style={styles.total}>
              Total Marks: {obtainedMarks} / {totalMarks}
            </Text>

            <TouchableOpacity
              style={styles.restartBtn}
              onPress={restartQuiz}
            >
              <Text style={styles.btnText}>Restart Quiz</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  container: {
    padding: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  qHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  question: {
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },

  mark: {
    fontSize: 12,
    color: "#555",
  },

  option: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },

  selected: {
    borderWidth: 1,
    borderColor: "#1e3a8a",
    backgroundColor: "#eef2ff",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },

  correct: {
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "#e6f7e6",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },

  wrong: {
    borderWidth: 1,
    borderColor: "red",
    backgroundColor: "#fdeaea",
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  },

  reviewText: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
  },

  submitBtn: {
    backgroundColor: "#1e3a8a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 16,
  },

  restartBtn: {
    backgroundColor: "#1e3a8a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  total: {
    textAlign: "center",
    fontWeight: "600",
    marginTop: 10,
  },
});
