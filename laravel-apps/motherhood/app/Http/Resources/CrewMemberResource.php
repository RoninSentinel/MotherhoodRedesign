<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CrewMemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return parent::toArray($request);

        // Example of how to return only the crew member's last name.
        //return ['last_name' => $this->last_name];

        // Example: a filtered model:
        // 'author' => new AuthorResource($this->author);
    }
}
