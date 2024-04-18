/**
 * Benchmarks runner with historical data preservation in cloud storage (InfluxDB)
 *
 * Run with
 * ```
 * ./run benchmark/runners/with-cloud-history.ts --bundle
 * ```
 */

import { initializeBindings } from 'o1js';
import { logResult } from '../benchmark.js';
import { EcdsaBenchmark } from '../benchmarks/ecdsa.js';
import { InitBenchmark } from '../benchmarks/init.js';
import {
  readPreviousResultFromInfluxDb,
  writeResultToInfluxDb,
} from '../utils/influxdb-utils.js';

const results = [];

// Run the initialization benchmark
results.push(...(await InitBenchmark.run()));
// Run all other benchmarks
await initializeBindings();
results.push(...(await EcdsaBenchmark.run()));

// Process and log results
for (const result of results) {
  const previousResult = await readPreviousResultFromInfluxDb(result);
  logResult(result, previousResult);
  writeResultToInfluxDb(result);
  console.log('\n');
}
