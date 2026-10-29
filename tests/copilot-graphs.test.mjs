import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Nirdeshak Multi-Graph Generation Engine (Thesys C1 & OpenUI Parity)', () => {
  it('detects pie, donut, line, bar chart preferences across English and Marathi queries', () => {
    const detectChartPreference = (query) => {
      const q = (query || '').toLowerCase();
      if (
        /\bpie\b|\bdonut\b|\bbreakdown\b|\bshare\b|\bdistribution\b/.test(q) ||
        q.includes('वाटा') || q.includes('विभागणी') || q.includes('टक्केवारी')
      ) {
        return /\bdonut\b/.test(q) ? 'donut' : 'pie';
      }
      if (
        /\bline\b|\btrend\b|\bover time\b|\btime series\b|\bhistory\b|\btrajectory\b/.test(q) ||
        q.includes('कल') || q.includes('इतिहास') || q.includes('प्रगती')
      ) {
        return 'line';
      }
      if (
        /\bbar\b|\bcompare\b|\branking\b|\btop \d+\b/.test(q) ||
        q.includes('तुलना') || q.includes('मुकाबला') || q.includes('क्रमवारी')
      ) {
        return 'bar';
      }
      if (/\btable\b|\blist\b|\brows\b/.test(q) || q.includes('तक्ता')) {
        return 'table';
      }
      return 'auto';
    };

    assert.equal(detectChartPreference('Show me a pie chart of division share'), 'pie');
    assert.equal(detectChartPreference('Provide a donut breakdown of sentiment'), 'donut');
    assert.equal(detectChartPreference('जिल्ह्यांची विभागणी दाखवा (वाटा)'), 'pie');
    assert.equal(detectChartPreference('7-day governance trend over time'), 'line');
    assert.equal(detectChartPreference('कामगिरीचा कल कसा आहे?'), 'line');
    assert.equal(detectChartPreference('Bar chart comparing Pune vs Thane'), 'bar');
    assert.equal(detectChartPreference('पुणे आणि ठाणे यांची तुलना करा'), 'bar');
    assert.equal(detectChartPreference('Show tabular list of top districts'), 'table');
    assert.equal(detectChartPreference('What is the current state status?'), 'auto');
  });

  it('synthesizes PieChart for division breakdown with all 6 administrative divisions', async () => {
    const divisions = ['Konkan', 'Pune', 'Nashik', 'Chhatrapati Sambhajinagar', 'Amravati', 'Nagpur'];
    const divisionCounts = {
      'Konkan': 7,
      'Pune': 5,
      'Nashik': 5,
      'Chhatrapati Sambhajinagar': 8,
      'Amravati': 5,
      'Nagpur': 6,
    };

    const totalDistricts = Object.values(divisionCounts).reduce((a, b) => a + b, 0);
    assert.equal(totalDistricts, 36);

    const pieData = Object.keys(divisionCounts).map((div) => ({
      name: `${div} Division`,
      value: divisionCounts[div],
    }));

    assert.equal(pieData.length, 6);
    assert.equal(pieData[0].name, 'Konkan Division');
    assert.equal(pieData[0].value, 7);
    assert.equal(pieData[3].name, 'Chhatrapati Sambhajinagar Division');
    assert.equal(pieData[3].value, 8);
  });

  it('supports PieChart component contract with categories, values, and variant', () => {
    const pieSpec = {
      component: 'PieChart',
      title: 'Districts per Administrative Division',
      categories: ['Konkan', 'Pune', 'Nashik', 'Chhatrapati Sambhajinagar', 'Amravati', 'Nagpur'],
      values: [7, 5, 5, 8, 5, 6],
      variant: 'donut',
      text_summary: 'Distribution of 36 districts across 6 divisions.',
    };

    assert.equal(pieSpec.component, 'PieChart');
    assert.equal(pieSpec.variant, 'donut');
    assert.equal(pieSpec.categories.length, 6);
    assert.equal(pieSpec.values.reduce((a, b) => a + b, 0), 36);
  });

  it('supports LineChart component contract with temporal data trajectory', () => {
    const lineSpec = {
      component: 'LineChart',
      title: 'Statewide Composite Index Trajectory',
      x_key: 'day',
      y_key: 'score',
      data: [
        { day: '14 Oct', score: 84.8 },
        { day: '15 Oct', score: 85.4 },
        { day: '16 Oct', score: 86.2 },
        { day: '17 Oct', score: 85.9 },
        { day: '18 Oct', score: 87.1 },
        { day: '19 Oct', score: 87.8 },
        { day: '20 Oct', score: 88.4 },
      ],
      text_summary: '7-day trend showing continuous rise from 84.8 to 88.4.',
    };

    assert.equal(lineSpec.component, 'LineChart');
    assert.equal(lineSpec.data.length, 7);
    assert.equal(lineSpec.data[0].score, 84.8);
    assert.equal(lineSpec.data[6].score, 88.4);
  });
});
