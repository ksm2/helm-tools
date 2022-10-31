import { Chart } from '../../src/helm/Chart';

describe('Chart', () => {
  let chart: Chart;

  beforeEach(() => {
    const y = yaml`
      apiVersion: v2
      name: my-chart
      version: "1.2.3"
      kubeVersion: "1.25.3"
      description: A Helm chart for Kubernetes
      type: application
      keywords: ["hello", "world"]
      home: "https://example.org"
      sources:
        - https://github.com/ksm2/helm-tools
      maintainers:
        - name: Konstantin Möllers
          email: ksm.moellers@gmail.com
          url: https://moellers.systems
      icon: "https://example.org/icon.png"
      appVersion: "4.5.6"
      deprecated: true
      annotations: []
    `;

    chart = Chart.readFromString(y);
  });

  it('should parse a string', () => {
    expect(chart.manifest.apiVersion).toBe('v2');
    expect(chart.manifest.name).toBe('my-chart');
    expect(chart.manifest.version).toBe('1.2.3');
    expect(chart.manifest.kubeVersion).toBe('1.25.3');
    expect(chart.manifest.description).toBe('A Helm chart for Kubernetes');
    expect(chart.manifest.type).toBe('application');
    expect(chart.manifest.keywords).toStrictEqual(['hello', 'world']);
    expect(chart.manifest.home).toBe('https://example.org');
    expect(chart.manifest.sources).toStrictEqual(['https://github.com/ksm2/helm-tools']);
    expect(chart.manifest.maintainers).toStrictEqual([
      {
        name: 'Konstantin Möllers',
        email: 'ksm.moellers@gmail.com',
        url: 'https://moellers.systems',
      },
    ]);
    expect(chart.manifest.icon).toBe('https://example.org/icon.png');
    expect(chart.manifest.appVersion).toBe('4.5.6');
    expect(chart.manifest.deprecated).toBe(true);
    expect(chart.manifest.annotations).toStrictEqual([]);
  });

  it('should change fields', () => {
    chart.manifest.apiVersion = 'v1';
    chart.manifest.name = 'my-other-chart';
    chart.manifest.version = '1.2.4';
    delete chart.manifest.kubeVersion;
    chart.manifest.description = 'Another Helm chart';
    chart.manifest.type = 'library';
    chart.manifest.keywords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    chart.manifest.home = 'https://example.com';
    chart.manifest.sources = [];
    chart.manifest.maintainers = [];
    chart.manifest.icon = undefined;
    chart.manifest.appVersion = '5.6.7';
    chart.manifest.deprecated = false;
    chart.manifest.annotations = { 'api.example.org/foo': 'bar' };

    expect(chart.manifest.apiVersion).toBe('v1');
    expect(chart.manifest.name).toBe('my-other-chart');
    expect(chart.manifest).not.toHaveProperty('kubeVersion');
    expect(chart.manifest.description).toBe('Another Helm chart');
    expect(chart.manifest.type).toBe('library');
    expect(chart.manifest.keywords).toStrictEqual(['lorem', 'ipsum', 'dolor', 'sit', 'amet']);
    expect(chart.manifest.home).toBe('https://example.com');
    expect(chart.manifest.sources).toStrictEqual([]);
    expect(chart.manifest.maintainers).toStrictEqual([]);
    expect(chart.manifest).not.toHaveProperty('icon');
    expect(chart.manifest.appVersion).toBe('5.6.7');
    expect(chart.manifest.deprecated).toBe(false);
    expect(chart.manifest.annotations).toStrictEqual({ 'api.example.org/foo': 'bar' });

    expect(chart.toString()).toBe(yaml`
      apiVersion: v1
      name: my-other-chart
      version: "1.2.4"
      kubeVersion: "1.25.3"
      description: Another Helm chart
      type: library
      keywords:
        - lorem
        - ipsum
        - dolor
        - sit
        - amet
      home: "https://example.com"
      sources: []
      maintainers: []
      appVersion: "5.6.7"
      deprecated: false
      annotations:
        api.example.org/foo: bar
    `);
  });

  function yaml(arr: TemplateStringsArray) {
    const str = arr.raw
      .join('')
      .replace(/^(\r\n|[\r\n])/, '')
      .trimEnd();
    const lines = str.split(/\r\n|[\r\n]/g);
    const minIndent = Math.min(...lines.map((line) => line.match(/^ */)![0]!.length));
    const indent = ' '.repeat(minIndent);
    return lines.map((line) => line.replace(indent, '') + '\n').join('');
  }
});
