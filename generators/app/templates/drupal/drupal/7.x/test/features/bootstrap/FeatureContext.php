<?php

use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\PyStringNode;
use Behat\Gherkin\Node\TableNode;
use Behat\Mink\Exception\ExpectationException;
use Behat\Mink\Exception\UnsupportedDriverActionException;
use Drupal\DrupalExtension\Context\RawDrupalContext;

/**
 * Define application features from the specific context.
 */
class FeatureContext extends RawDrupalContext implements SnippetAcceptingContext {

  /**
   * Initializes context.
   *
   * Every scenario gets its own context object.
   *
   * @param array $parameters
   *   Context parameters (set them in behat.yml)
   */
  public function __construct(array $parameters = []) {
    // Initialize your context here
  }

  /**
   * Get a list of UIDs.
   *
   * You can create test steps using this method call to target tests against
   * specific users in the sequential order of creation.
   *
   * @code
   * $ids = $this->getUserIds();
   * $id = end($ids);
   * @endcode
   *
   * @return array
   *   An array of numeric UIDs of users created by Given... steps during this scenario.
   */
  public function getUserIds() {
    $uids = array();
    foreach ($this->users as $user) {
      $uids[] = $user->uid;
    }
    return $uids;
  }

  /**
   * Get a list of nids.
   *
   * You can create test steps using this method call to target tests against
   * specific users in the sequential order of creation.
   *
   * @code
   * $ids = $this->getNodeIds();
   * $id = end($ids);
   * @endcode
   *
   * @return array
   *   An array of numeric NIDs of Nodes created by Given... steps during this scenario.
   */
  public function getNodeIds() {
    $nids = array();
    foreach ($this->nodes as $node) {
      $nids[] = $node->nid;
    }

    return $nids;
  }

  /**
   * Checks on the content type header response to the latest request.
   *
   * @param string $value
   *   Expected value of the content-type header.
   *
   * @Then /^(?:the )?response MIME type should be "([^"]*)"$/
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  public function theContentTypeHeaderShouldBe($value) {
    $type = $this->getSession()->getResponseHeader('Content-Type');
    if ($value && $value == $type) {
      return;
    }

    throw new ExpectationException(
      "Content-Type is incorrect, found '$type'.",
      $this->getSession()->getDriver()
    );
  }

  /**
   * Checks, whether the HTTP header name is not equal to given text
   *
   * @param string $name
   *   The name of the HTTP header to be evaluated.
   * @param string $value
   *   The value we do not want to see for the HTTP header.
   *
   * @Then the header :name should not equal :value
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  public function theHeaderShouldNotBeEqualTo($name, $value) {
    $actual = $this->getSession()->getResponseHeader($name);
    if (strtolower($value) == strtolower($actual)) {
      throw new ExpectationException(
        "The header '$name' is equal to '$actual'",
        $this->getSession()->getDriver()
      );
    }
  }

  /**
   * Check that the current page response status is in the specified range.
   *
   * A range would look like 1xx, 2xx, 3xx, 4xx, or 5xx.
   *
   * @param string $mask
   *   An HTTP status code in mask format.
   *
   * @Then the response status code should be in the :mask range.
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  public function hasStatusRange($mask) {
    $actual = $this->getSession()->getStatusCode();

    if (substr($mask, 0, 1) != substr($actual, 0, 1)) {
      $message = sprintf('Response code range %s expected, %s found', $mask, $actual);
      throw new ExpectationException($message, $this->getSession()->getDriver());
    }
  }

  /**
   * Follow redirect instructions.
   *
   * @Then /^I (?:am|should be) redirected$/
   *
   * @throws \Behat\Mink\Exception\ExpectationException
   */
  public function iAmRedirected() {
    $headers = $this->getSession()->getResponseHeaders();
    if (empty($headers['Location']) && empty($headers['location'])) {
      throw new ExpectationException('The response should contain a "Location" header');
    }
    $client = $this->getClient();
    $client->followRedirects(true);
    $client->followRedirect();
  }

  /**
   * Pauses the test process for the specified number of seconds.
   *
   * This is an unreliable means of waiting for something to happen, as server
   * resource utilitization can easily slow down a process. Some kind of polling
   * mechanism is recommended.
   *
   * @param string $value
   *   Length of time the process will wait.
   *
   * @Then /^I wait for (\d+) seconds?$/
   */
  public function iWaitForSeconds($value) {
    sleep($value);
  }

  /**
   * Returns current active mink session.
   *
   * This allows greater insight and control of HTTP interactions such as in
   * FeatureContext::iAmRedirected.
   *
   * @return \Symfony\Component\BrowserKit\Client
   *   Returns the browser session.
   *
   * @throws \Behat\Mink\Exception\UnsupportedDriverActionException
   */
  protected function getClient() {
    $driver = $this->getSession()->getDriver();
    if (!$driver instanceof BrowserKitDriver) {
      $message = 'This step is only supported by the browserkit drivers';
      throw new UnsupportedDriverActionException($message, $driver);
    }
    return $driver->getClient();
  }

}
