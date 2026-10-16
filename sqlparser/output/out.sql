-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT MAX(price) FROM products;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT COUNT(*) FROM customers;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT MIN(order_total) FROM orders;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT SUM(revenue) FROM weird_table_name_123;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(age) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(experience_years) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(performance_rating) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(bonus_amount) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT COUNT(department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT MAX(department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT MIN(department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT SUM(department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) as average_salary FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) as avg_sal FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) as mean FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) as salary_mean FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(salary) as company_average FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(`salary`) FROM `employees`;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT MAX(`user-id`) FROM `user-data`;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    COUNT(employee_id) as total_employees,
    AVG(annual_salary) as avg_annual,
    MAX(years_of_service) as longest_tenure,
    MIN(performance_score) as lowest_score,
    SUM(vacation_days_taken) as total_vacation
FROM company_employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT first_name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT product_name, price
FROM products
WHERE price < (SELECT MIN(price) FROM products);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT customer_name, age
FROM customers
WHERE age > (SELECT AVG(age) FROM customers);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT company_name, revenue
FROM companies
WHERE revenue > (SELECT SUM(revenue) FROM companies);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: False

-- ERRORS:
--  - Missing required 'FROM' clause
SELECT department_id, COUNT(*) as count
FROM employees
GROUP BY department_id;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT office_location, AVG(salary) as avg_sal
FROM employees
GROUP BY office_location;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT job_title, MAX(salary) as max_sal
FROM employees
GROUP BY job_title;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT hire_year, COUNT(*) as new_hires
FROM employees
GROUP BY hire_year;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT department_id, AVG(salary) as avg_sal
FROM employees
GROUP BY department_id
HAVING avg_sal > 50000;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT department_id, AVG(salary) as avg_sal
FROM employees
GROUP BY department_id
HAVING avg_sal > 75000;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT department_id, AVG(salary) as avg_sal
FROM employees
GROUP BY department_id
HAVING avg_sal > 100000;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT department_id, COUNT(*) as emp_count
FROM employees
GROUP BY department_id
HAVING emp_count > 10;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT name, value
FROM table1
WHERE value > (
    SELECT AVG(value)
    FROM table2
    WHERE category = (SELECT category FROM table3)
);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT name, amount
FROM transactions
WHERE amount > (
    SELECT AVG(amount)
    FROM transactions
    WHERE user_id = (
        SELECT user_id
        FROM users
        WHERE status = (SELECT status FROM config)
    )
);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT COUNT(DISTINCT department_id) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT COUNT(DISTINCT job_title) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT COUNT(DISTINCT location) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT AVG(DISTINCT salary) FROM employees;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price,
    MIN(price) as cheapest,
    MAX(price) as most_expensive
FROM products
GROUP BY category
HAVING product_count > 5;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    department_name,
    COUNT(*) as headcount,
    AVG(salary) as average_compensation,
    MAX(salary) as top_earner
FROM hr_employees
GROUP BY department_name
HAVING average_compensation > 60000;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    account_type,
    SUM(transaction_amount) as total_transactions,
    AVG(transaction_amount) as avg_transaction,
    COUNT(*) as transaction_count
FROM financial_transactions
GROUP BY account_type;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    region,
    COUNT(*) as deal_count,
    SUM(deal_value) as total_revenue,
    AVG(deal_value) as avg_deal_size
FROM sales_pipeline
GROUP BY region
HAVING total_revenue > 1000000;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    age_group,
    COUNT(*) as patient_count,
    AVG(treatment_duration) as avg_duration,
    MIN(treatment_duration) as shortest_stay,
    MAX(treatment_duration) as longest_stay
FROM patient_records
GROUP BY age_group;

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: False

-- ERRORS:
--  - Missing required 'FROM' clause
SELECT 
    dept,
    total,
    average,
    highest,
    lowest
FROM (
    SELECT 
        department_id as dept,
        COUNT(*) as total,
        AVG(salary) as average,
        MAX(salary) as highest,
        MIN(salary) as lowest
    FROM employees
    GROUP BY department_id
) as stats
WHERE total > (SELECT AVG(total) FROM department_counts);

-- Source: input\test.sql
-- DIALECT: MySQL
-- STATEMENT TYPE: SELECT
-- VALID: True
SELECT 
    employee_name,
    current_salary,
    (SELECT AVG(salary) FROM all_employees) as company_avg,
    (SELECT MAX(salary) FROM all_employees) as company_max,
    (SELECT MIN(salary) FROM all_employees) as company_min,
    (SELECT COUNT(*) FROM all_employees) as total_employees
FROM all_employees
WHERE current_salary > (SELECT AVG(salary) FROM all_employees);

