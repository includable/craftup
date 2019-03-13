<?php

namespace craft\contentmigrations;

use Craft;
use craft\db\Migration;

/**
 * Migration that is run the first time Craft is installed,
 * making the process of setting up a new site slightly
 * less repetitive.
 */
class m190308_142035_startup extends Migration
{

    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        // Enable Redactor plugin
        Craft::$app->plugins->installPlugin('redactor');

        // Create a default local volume
        $volumes = Craft::$app->getVolumes();
        if(empty($volumes->getAllVolumes())) {
            $volumes->saveVolume($volumes->createVolume([
                'name' => 'Uploads',
                'handle' => 'uploads',
                'type' => 'craft\\volumes\\Local',
                'hasUrls' => true,
                'url' => '@web/uploads',
                'settings' => [
                    'path' => '@webroot/uploads'
                ]
            ]));
        }
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        return true;
    }
}
