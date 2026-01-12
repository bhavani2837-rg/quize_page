import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import 'expo-router/entry-classic';
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
/* ================= TYPES ================= */
type Question = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  marks: number;
};
/* ================= DUMMY DATA ================= */
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
/* ================= QUIZ SCREEN ================= */
const QuizScreen: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const navigation = useNavigation(); // Navigation hook
  const answeredCount = Object.keys(answers).length;

  const selectOption = (qId: number, index: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [qId]: index });
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
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.arrowBtn}
        >
          <Feather name="arrow-left" size={28} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.title}>Bodha UPSC – Daily Quiz</Text>
      </View>

      {/* ================= PROGRESS ================= */}
      <Text style={styles.progress}>
        Answered {answeredCount} / {QUESTIONS.length}
      </Text>

      {/* ================= QUESTIONS ================= */}
      <ScrollView contentContainerStyle={styles.container}>
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

              const optionStyles = [
                styles.option,
                !submitted && selected && styles.selected,
                submitted && isCorrect && styles.correct,
                submitted && selected && !isCorrect && styles.wrong,
              ];

              return (
                <TouchableOpacity
                  key={idx}
                  style={optionStyles}
                  onPress={() => selectOption(q.id, idx)}
                >
                  <Text style={styles.optionText}>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                </TouchableOpacity>
              );
            })}

            {submitted && (
              <Text style={styles.reviewText}>
                {answers[q.id] === undefined
                  ? "⚪ Not Attempted · Marks: 0"
                  : answers[q.id] === q.correctIndex
                  ? `✔ Correct · +${q.marks} Mark`
                  : `✖ Incorrect · Correct: Option ${String.fromCharCode(
                      65 + q.correctIndex
                    )} · Marks: 0`}
              </Text>
            )}
          </View>
        ))}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ================= STICKY FOOTER ================= */}
      <View style={styles.footer}>
        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              answeredCount !== QUESTIONS.length && styles.disabledBtn,
            ]}
            disabled={answeredCount !== QUESTIONS.length}
            onPress={() => setSubmitted(true)}
          >
            <Text style={styles.btnText}>Submit Quiz</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.total}>
              Total Marks: {obtainedMarks} / {totalMarks}
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={restartQuiz}>
              <Text style={styles.btnText}>Restart Quiz</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
/* ================= STYLES ================= */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 50,
    backgroundColor: "#e0e7ff",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  progress: { paddingHorizontal: 16, paddingBottom: 6, fontSize: 12, color: "#555" },
  container: { padding: 16 },
  card: { backgroundColor: "#fff", padding: 14, borderRadius: 10, marginBottom: 14 },
  qHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  question: { fontWeight: "600", flex: 1, marginRight: 8 },
  mark: { fontSize: 12, color: "#666" },
  option: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginVertical: 5 },
  optionText: { fontSize: 14 },
  selected: { borderColor: "#1e3a8a", backgroundColor: "#eef2ff" },
  correct: { borderColor: "#2e7d32", backgroundColor: "#e8f5e9" },
  wrong: { borderColor: "#c62828", backgroundColor: "#fdecea" },
  reviewText: { marginTop: 8, fontSize: 12, color: "#333" },
  footer: { padding: 12, borderTopWidth: 1, borderTopColor: "#eee", backgroundColor: "#fff" },
  primaryBtn: { backgroundColor: "#1e3a8a", padding: 14, borderRadius: 8, alignItems: "center" },
  disabledBtn: { backgroundColor: "#9fa8da" },
  btnText: { color: "#fff", fontWeight: "600" },
  total: { textAlign: "center", fontWeight: "600", marginBottom: 8 },
});

export default QuizScreen;
