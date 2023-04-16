# Naïve Bayes Classifier Algorithm
* Naïve Bayes is a supervised machine learning algorithm.  
* It is base on **Bayes theorem**.
* It is used to solve classification problems.
* It is a **Probablisitic Classifier**, which means it predicts on the basis of the probability of an object.
* **Naïve** [unaffected]: It is called Naïve because it assumes that the occurence of a certain feature is independent of the occurence of other feature.
* **Bayes**: It is called Bayes because it depends on the principle of Bayes' Theorem.

## Bayes' Theorem:
* Bayes' theorem is also known as Bayes' Rule or Bayes' law, which is used to determine the probability of a hypothesis with prior knowledge. It depends on the conditional probability.
* Using Bayes theorem, we can find the probability of A happening, given that B has occurred. Here, B is the evidence and A is the hypothesis. The assumption made here is that the predictors/features are independent.
$$
\begin{equation*}
P(A~|~B) = \frac{P(B~|~A) \cdot P(A)}{P(B)}
\end{equation*}
$$
* Where,  
    1. $P(A~|~B)$ is **Posterior Probability**: Probability of hypothesis A on the observed event B.
    2. $P(B~|~A)$ is **Likelihood Probability**: Probability of the evidence given that the probability of a hypothesis is true.
    3. $P(A)$ is **Prior Probability**: Probability of the hypothesis before observing the evidence.
    4. $P(B)$ is **Marginal Probability**: Probability of evidence. 

## Example of Bayes' Theorem